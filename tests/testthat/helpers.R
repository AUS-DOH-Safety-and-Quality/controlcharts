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
