parse_styles <- function(style_str) {
  style_elements <- strsplit(style_str, ";", fixed = TRUE)[[1]]
  named_values <- sapply(style_elements, function(x) {
    x_split <- strsplit(x, ":", fixed = TRUE)[[1]]
    value <- trimws(x_split[2])
    names(value) <- trimws(x_split[1])
    value
  }, USE.NAMES = FALSE)
  as.list(named_values)
}

parse_rgb <- function(rgb_string) {
  rgb_vals <- as.numeric(strsplit(gsub("rgb\\(|\\)", "", rgb_string), ",")[[1]])
  grDevices::rgb(rgb_vals[1], rgb_vals[2], rgb_vals[3], maxColorValue = 255)
}

parse_dots <- function(nodeset) {
  dots_nodes <- xml2::xml_children(xml2::xml_find_all(nodeset, './/*[@class="dotsgroup"]'))
  dots_list <- lapply(xml2::xml_attrs(dots_nodes), function(x) {
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
  axis_list <- lapply(axis_ticks, function(tickgroup) {
    ticktextgroup <- xml2::xml_find_first(tickgroup, './/text')
    ticktext_style <- parse_styles(xml2::xml_attr(ticktextgroup, "style"))

    ticktext_style$fill = parse_rgb(ticktext_style$fill)
    ticktext_style$opacity = xml2::xml_attr(tickgroup, "opacity")
    ticktext_style$transform = xml2::xml_attr(tickgroup, "transform")
    ticktext_style$x = as.numeric(gsub("translate\\((.*),(.*)\\)", "\\1", ticktext_style$transform))
    ticktext_style$y = as.numeric(gsub("translate\\((.*),(.*)\\)", "\\2", ticktext_style$transform))
    ticktext_style$rotation = xml2::xml_attr(ticktextgroup, "transform")
    ticktext_style$value = xml2::xml_text(ticktextgroup)
    data.frame(ticktext_style)
  })
  axis_df <- do.call(rbind.data.frame, axis_list)
  axis_df
}

parse_lines <- function(nodeset) {
  all_lines <- xml2::xml_find_all(nodeset, './/*[@class="linesgroup"]//g')
  lines_list <- lapply(all_lines, function(line) {
    line_list <- parse_styles(xml2::xml_attr(line, "style"))
    line_list$line <- gsub("(.*)-.*", "\\1", xml2::xml_attr(line, "class"))

    path <- xml2::xml_find_first(line, ".//path")
    line_list$stroke <- xml2::xml_attr(path, "stroke")
    line_list$`stroke-dasharray` <- xml2::xml_attr(path, "stroke-dasharray")
    line_list$`stroke-width` <- xml2::xml_attr(path, "stroke-width")
    line_list$d <- xml2::xml_attr(path, "d")
    data.frame(line_list)
  })
  lines_df <- do.call(rbind.data.frame, lines_list)
  lines_df$`stroke.opacity` <- as.numeric(lines_df$`stroke.opacity`)
  lines_df$`stroke.width` <- as.numeric(lines_df$`stroke.width`)
  lines_df
}
