init_chromote <- function() {
  if (Sys.getenv("CHROMOTE_CHROME") == "") {
    edge_path <- "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"

    if (.Platform$OS.type == "windows" && file.exists(edge_path)) {
      Sys.setenv(CHROMOTE_CHROME = edge_path)
    } else {
      local({chromote::local_chrome_version(binary = "chrome-headless-shell", quiet = TRUE)})
      chrome_vers <- chromote::chrome_versions_list()
      chrome_path <- chrome_vers[order(chrome_vers$revision, decreasing = TRUE), ]$path[1]
      Sys.setenv(CHROMOTE_CHROME = chrome_path)
    }
  }

  # Need to temporarily ignore http/s proxy when initialising chromote
  # session, otherwise it fails to connect
  proxies <- Sys.getenv(c("https_proxy", "http_proxy"))
  if (any(proxies != "")) {
    on.exit(do.call(Sys.setenv, as.list(proxies)), add = TRUE)
    Sys.unsetenv("http_proxy")
    Sys.unsetenv("https_proxy")
  }

  chromote::set_default_chromote_object(chromote::Chromote$new())
  invisible(NULL)
}

parse_styles <- function(style_str) {
  strsplit(style_str, ";", fixed = TRUE)[[1]] |>
    sapply(\(x) {
      x_split <- strsplit(x, ":", fixed = TRUE)[[1]]
      value <- trimws(x_split[2])
      names(value) <- trimws(x_split[1])
      value
    }, USE.NAMES = FALSE) |>
      as.list()
}

test_linegroup <- function(nodeset, linetype, settings = NULL) {
  if (is.null(settings)) {
    settings <- spc_default_settings("lines")
  } else {
    input_settings <- settings
    settings <- spc_default_settings("lines")
    for (setting in names(input_settings)) {
      settings[[setting]] <- input_settings[[setting]]
    }
  }

  nodename <- paste0(linetype, "-linegroup")
  if (linetype == "main") {
    nodename <- gsub("main", "values", nodename, fixed = TRUE)
  } else if (linetype == "target") {
    nodename <- gsub("target", "targets", nodename, fixed = TRUE)
  }


  lg <- xml2::xml_find_first(nodeset, paste0('.//*[@class="', nodename, '"]'))
  expect_length(lg, 2)

  if (substr(linetype, 1, 2) %in% c("ll", "ul")) {
    linetype <- substr(linetype, 3, 4)
  }

  lg_styles <- parse_styles(xml2::xml_attr(lg, "style"))
  expect_equal(lg_styles$`stroke-opacity`, as.character(settings[[paste0("opacity_", linetype)]]))

  pth <- as.list(xml2::xml_attrs(xml2::xml_child(lg)))
  expect_equal(pth$stroke, settings[[paste0("colour_", linetype)]])
  expect_equal(pth$`stroke-dasharray`, settings[[paste0("type_", linetype)]])
  expect_equal(pth$`stroke-width`, as.character(settings[[paste0("width_", linetype)]]))
}

parse_rgb <- function(rgb_string) {
  rgb_vals <- as.numeric(strsplit(gsub("rgb\\(|\\)", "", rgb_string), ",")[[1]])
  grDevices::rgb(rgb_vals[1], rgb_vals[2], rgb_vals[3], maxColorValue = 255)
}

parse_dots <- function(nodeset) {
  dots_nodes <- xml2::xml_children(xml2::xml_find_all(nodeset, './/*[@class="dotsgroup"]'))
  dots_list <- lapply(xml2::xml_attrs(dots_nodes), \(x) {
    dot <- parse_styles(x["style"])
    dot$fill <- parse_rgb(dot$fill)
    dot$stroke <- parse_rgb(dot$stroke)
    dot$d <- x["d"]
    dot$transform <- x["transform"]
    dot$x <- as.numeric(gsub("translate\\((.*),(.*)\\)", "\\1", dot$transform))
    dot$y <- as.numeric(gsub("translate\\((.*),(.*)\\)", "\\2", dot$transform))
    data.frame(dot)
  })
  dots_df <- do.call(rbind.data.frame, dots_list)
  dots_df$`stroke.width` <- as.numeric(dots_df$`stroke.width`)
  dots_df$`fill.opacity` <- as.numeric(dots_df$`fill.opacity`)
  dots_df$`stroke.opacity` <- as.numeric(dots_df$`stroke.opacity`)
  dots_df
}

parse_axis <- function(axis, nodeset) {
  axis_node <-  xml2::xml_find_first(nodeset, paste0('.//*[@class="', axis, 'axisgroup"]'))
  axis_ticks <- xml2::xml_find_all(axis_node, './/*[@class="tick"]')
  axis_list <- lapply(axis_ticks, \(tickgroup) {
    ticktextgroup <- xml2::xml_find_first(tickgroup, './/text')
    ticktext_style <- parse_styles(xml2::xml_attr(ticktextgroup, "style"))

    ticktext_style$fill = parse_rgb(ticktext_style$fill)
    ticktext_style$opacity = xml2::xml_attr(tickgroup, "opacity")
    ticktext_style$transform = xml2::xml_attr(tickgroup, "transform")
    ticktext_style$x = as.numeric(gsub("translate\\((.*),(.*)\\)", "\\1", ticktext_style$transform))
    ticktext_style$y = as.numeric(gsub("translate\\((.*),(.*)\\)", "\\2", ticktext_style$transform))
    ticktext_style$rotation = xml2::xml_attr(ticktextgroup, "transform")
    ticktext_style$value = xml2::xml_double(ticktextgroup)
    data.frame(ticktext_style)
  })
  axis_df <- do.call(rbind.data.frame, axis_list)
  axis_df
}
