cc_fixture_dir <- function() {
  system.file("tinytest", "_fixtures", package = "controlcharts")
}

cc_list_fixture_files <- function(prefix) {
  fixture_dir <- cc_fixture_dir()
  if (identical(fixture_dir, "")) {
    return(character(0))
  }
  list.files(fixture_dir, pattern = paste0("^", prefix, ".*\\.rds$"), full.names = TRUE)
}

cc_read_fixture <- function(path) {
  if (!file.exists(path)) {
    stop("Missing fixture: ", path, call. = FALSE)
  }
  readRDS(path)
}

cc_as_name <- function(x) {
  if (!is.character(x) || length(x) != 1 || !nzchar(x)) {
    stop("Expected a single, non-empty character string", call. = FALSE)
  }
  as.name(x)
}

cc_call_spc <- function(data, keys, numerators, denominators = NULL,
                        groupings = NULL, xbar_sds = NULL,
                        spc_settings = NULL,
                        canvas_settings = NULL,
                        outlier_settings = NULL) {
  args <- list(
    data = data,
    keys = cc_as_name(keys),
    numerators = cc_as_name(numerators),
    canvas_settings = canvas_settings,
    spc_settings = spc_settings,
    outlier_settings = outlier_settings
  )
  if (!is.null(denominators)) {
    args$denominators <- cc_as_name(denominators)
  }
  if (!is.null(groupings)) {
    args$groupings <- cc_as_name(groupings)
  }
  if (!is.null(xbar_sds)) {
    args$xbar_sds <- cc_as_name(xbar_sds)
  }

  do.call(controlcharts::spc, args)
}

cc_call_funnel <- function(data, keys, numerators, denominators,
                           funnel_settings = NULL,
                           canvas_settings = NULL,
                           outlier_settings = NULL) {
  args <- list(
    data = data,
    keys = cc_as_name(keys),
    numerators = cc_as_name(numerators),
    denominators = cc_as_name(denominators),
    canvas_settings = canvas_settings,
    funnel_settings = funnel_settings,
    outlier_settings = outlier_settings
  )
  do.call(controlcharts::funnel, args)
}

cc_drop_spc_to_expected <- function(actual, expected_cols) {
  if (!all(expected_cols %in% names(actual))) {
    missing <- setdiff(expected_cols, names(actual))
    stop("Actual limits missing expected columns: ", paste0(missing, collapse = ", "), call. = FALSE)
  }
  actual <- actual[, expected_cols, drop = FALSE]
  actual
}

cc_drop_funnel_to_expected <- function(actual, expected_cols) {
  if (!all(expected_cols %in% names(actual))) {
    missing <- setdiff(expected_cols, names(actual))
    stop("Actual limits missing expected columns: ", paste0(missing, collapse = ", "), call. = FALSE)
  }
  actual <- actual[, expected_cols, drop = FALSE]
  actual
}

cc_almost_equal_numeric <- function(x, y, tol_abs = 1e-8, tol_rel = 1e-6) {
  if (length(x) != length(y)) {
    return(FALSE)
  }
  ok <- mapply(function(a, b) {
    if (is.na(a) && is.na(b)) {
      return(TRUE)
    }
    if (is.na(a) || is.na(b)) {
      return(FALSE)
    }
    if (!is.finite(a) || !is.finite(b)) {
      return(identical(a, b))
    }
    abs(a - b) <= (tol_abs + tol_rel * abs(b))
  }, x, y, SIMPLIFY = TRUE, USE.NAMES = FALSE)
  all(ok)
}

cc_expect_limits_equal <- function(actual, expected, tol_abs = 1e-8, tol_rel = 1e-6, context = NULL) {
  prefix <- ""
  if (!is.null(context)) {
    prefix <- paste0("[", context, "] ")
  }

  expect_true(
    identical(names(actual), names(expected)),
    info = paste0(prefix, "Column mismatch. Actual: ", paste(names(actual), collapse = ", "),
                  " | Expected: ", paste(names(expected), collapse = ", "))
  )
  expect_true(
    nrow(actual) == nrow(expected),
    info = paste0(prefix, "Row mismatch. Actual: ", nrow(actual), " | Expected: ", nrow(expected))
  )

  for (col in names(expected)) {
    a <- actual[[col]]
    e <- expected[[col]]

    if (is.numeric(e)) {
      expect_true(
        cc_almost_equal_numeric(a, e, tol_abs = tol_abs, tol_rel = tol_rel),
        info = paste0(prefix, "Numeric mismatch in column '", col, "'")
      )
    } else {
      expect_true(
        identical(a, e),
        info = paste0(prefix, "Mismatch in column '", col, "'")
      )
    }
  }
}
