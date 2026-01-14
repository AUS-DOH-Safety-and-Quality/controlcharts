#!/usr/bin/env Rscript

# Generates committed test fixtures under inst/tinytest/_fixtures.
#
# Fixtures are used at test-time WITHOUT requiring qicharts2/FunnelPlotR.
# This script is dev-only and may require those packages.

stop_if_missing <- function(pkg) {
  if (!requireNamespace(pkg, quietly = TRUE)) {
    stop("Package '", pkg, "' is required to generate fixtures but is not installed.", call. = FALSE)
  }
}

stop_if_missing("controlcharts")
stop_if_missing("qicharts2")
stop_if_missing("FunnelPlotR")

# Some packages (notably qicharts2) initialise internal defaults on attach.
suppressPackageStartupMessages(library(qicharts2))

fixture_dir <- file.path("inst", "tinytest", "_fixtures")
dir.create(fixture_dir, recursive = TRUE, showWarnings = FALSE)

write_fixture <- function(name, obj) {
  path <- file.path(fixture_dir, name)
  saveRDS(obj, path)
  message("Wrote ", path)
}

pkg_versions <- function() {
  c(
    controlcharts = as.character(utils::packageVersion("controlcharts")),
    qicharts2 = as.character(utils::packageVersion("qicharts2")),
    FunnelPlotR = as.character(utils::packageVersion("FunnelPlotR"))
  )
}

as_name <- function(x) {
  stopifnot(is.character(x), length(x) == 1, nzchar(x))
  as.name(x)
}

cc_call_spc <- function(data, keys, numerators, denominators = NULL,
                        xbar_sds = NULL, spc_settings = NULL) {
  args <- list(
    data = data,
    keys = as_name(keys),
    numerators = as_name(numerators),
    spc_settings = spc_settings
  )
  if (!is.null(denominators)) {
    args$denominators <- as_name(denominators)
  }
  if (!is.null(xbar_sds)) {
    args$xbar_sds <- as_name(xbar_sds)
  }
  do.call(controlcharts::spc, args)
}

cc_call_funnel <- function(data, keys, numerators, denominators, funnel_settings = NULL) {
  args <- list(
    data = data,
    keys = as_name(keys),
    numerators = as_name(numerators),
    denominators = as_name(denominators),
    funnel_settings = funnel_settings
  )
  do.call(controlcharts::funnel, args)
}

normalize_spc_qic <- function(qic_df) {
  qic_df <- qic_df[order(qic_df$x), , drop = FALSE]
  qic_df <- qic_df[!is.na(qic_df$y), , drop = FALSE]

  out <- data.frame(
    value = as.numeric(qic_df$y),
    target = as.numeric(qic_df$cl)
  )
  if ("lcl.95" %in% names(qic_df) && !all(is.na(qic_df$lcl.95))) out$ll95 <- as.numeric(qic_df$lcl.95)
  if ("ucl.95" %in% names(qic_df) && !all(is.na(qic_df$ucl.95))) out$ul95 <- as.numeric(qic_df$ucl.95)
  if ("lcl" %in% names(qic_df) && !all(is.na(qic_df$lcl))) out$ll99 <- as.numeric(qic_df$lcl)
  if ("ucl" %in% names(qic_df) && !all(is.na(qic_df$ucl))) out$ul99 <- as.numeric(qic_df$ucl)
  out
}

normalize_limits_subset <- function(limits_df, expected_cols) {
  limits_df <- limits_df[, expected_cols, drop = FALSE]
  for (nm in names(limits_df)) {
    if (is.factor(limits_df[[nm]])) {
      limits_df[[nm]] <- as.character(limits_df[[nm]])
    }
  }
  limits_df
}

spc_fixture <- function(name, data, keys, numerators, denominators = NULL,
                        xbar_sds = NULL, spc_settings,
                        qic_df) {
  cc_obj <- cc_call_spc(
    data = data,
    keys = keys,
    numerators = numerators,
    denominators = denominators,
    xbar_sds = xbar_sds,
    spc_settings = spc_settings
  )

  expected <- normalize_spc_qic(qic_df)
  actual <- normalize_limits_subset(cc_obj$limits, names(expected))

  list(
    meta = list(
      kind = "spc",
      fixture = name,
      created_utc = format(Sys.time(), tz = "UTC", usetz = TRUE),
      packages = pkg_versions()
    ),
    input = list(
      data = data,
      controlcharts = list(
        keys = keys,
        numerators = numerators,
        denominators = denominators,
        xbar_sds = xbar_sds,
        spc_settings = spc_settings
      )
    ),
    expected = expected,
    generated_actual = actual
  )
}

# --- SPC fixtures ---
set.seed(1)

spc_base <- data.frame(
  key = 1:20,
  val = c(10, 11, 9, 10.5, 10.2, 9.7, 10.1, 10.3, 9.9, 10.4,
          10.0, 9.8, 10.6, 10.7, 10.2, 10.1, 9.9, 10.3, 10.4, 10.5)
)

write_fixture(
  "spc_run.rds",
  spc_fixture(
    "spc_run.rds",
    data = spc_base,
    keys = "key",
    numerators = "val",
    spc_settings = list(chart_type = "run"),
    qic_df = qic(spc_base$key, spc_base$val, chart = "run", return.data = TRUE)
  )
)

write_fixture(
  "spc_i.rds",
  spc_fixture(
    "spc_i.rds",
    data = spc_base,
    keys = "key",
    numerators = "val",
    spc_settings = list(chart_type = "i"),
    qic_df = qic(spc_base$key, spc_base$val, chart = "i", return.data = TRUE)
  )
)

write_fixture(
  "spc_mr.rds",
  spc_fixture(
    "spc_mr.rds",
    data = spc_base,
    keys = "key",
    numerators = "val",
    spc_settings = list(chart_type = "mr"),
    qic_df = qic(spc_base$key, spc_base$val, chart = "mr", return.data = TRUE)
  )
)

spc_c <- data.frame(key = 1:20, count = c(2, 1, 3, 2, 4, 3, 1, 2, 3, 4, 2, 1, 5, 4, 3, 2, 3, 2, 1, 2))
write_fixture(
  "spc_c.rds",
  spc_fixture(
    "spc_c.rds",
    data = spc_c,
    keys = "key",
    numerators = "count",
    spc_settings = list(chart_type = "c"),
    qic_df = qic(spc_c$key, spc_c$count, chart = "c", return.data = TRUE)
  )
)

spc_u <- data.frame(
  key = 1:20,
  count = c(5, 6, 7, 5, 8, 7, 9, 10, 9, 8, 7, 6, 8, 7, 9, 10, 8, 7, 6, 5),
  denom = c(20, 22, 18, 25, 20, 23, 21, 19, 24, 20, 22, 18, 25, 20, 23, 21, 19, 24, 20, 22)
)
write_fixture(
  "spc_u.rds",
  spc_fixture(
    "spc_u.rds",
    data = spc_u,
    keys = "key",
    numerators = "count",
    denominators = "denom",
    spc_settings = list(chart_type = "u"),
    qic_df = qic(spc_u$key, spc_u$count, n = spc_u$denom, chart = "u", return.data = TRUE)
  )
)

write_fixture(
  "spc_up.rds",
  spc_fixture(
    "spc_up.rds",
    data = spc_u,
    keys = "key",
    numerators = "count",
    denominators = "denom",
    spc_settings = list(chart_type = "up"),
    qic_df = qic(spc_u$key, spc_u$count, n = spc_u$denom, chart = "up", return.data = TRUE)
  )
)

spc_p <- data.frame(
  key = 1:20,
  num = c(5, 6, 7, 5, 8, 7, 9, 10, 9, 8, 7, 6, 8, 7, 9, 10, 8, 7, 6, 5),
  den = c(20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25)
)
write_fixture(
  "spc_p.rds",
  spc_fixture(
    "spc_p.rds",
    data = spc_p,
    keys = "key",
    numerators = "num",
    denominators = "den",
    spc_settings = list(chart_type = "p", multiplier = 100, perc_labels = "No"),
    qic_df = qic(spc_p$key, spc_p$num, n = spc_p$den, chart = "p", multiply = 100, return.data = TRUE)
  )
)

write_fixture(
  "spc_pp.rds",
  spc_fixture(
    "spc_pp.rds",
    data = spc_p,
    keys = "key",
    numerators = "num",
    denominators = "den",
    spc_settings = list(chart_type = "pp", multiplier = 100, perc_labels = "No"),
    qic_df = qic(spc_p$key, spc_p$num, n = spc_p$den, chart = "pp", multiply = 100, return.data = TRUE)
  )
)

spc_g <- data.frame(key = 0:19, g = c(2, 1, 3, 2, 4, 3, 1, 2, 3, 4, 2, 1, 5, 4, 3, 2, 3, 2, 1, 2))
write_fixture(
  "spc_g.rds",
  spc_fixture(
    "spc_g.rds",
    data = spc_g,
    keys = "key",
    numerators = "g",
    spc_settings = list(chart_type = "g"),
    qic_df = qic(spc_g$key, spc_g$g, chart = "g", return.data = TRUE)
  )
)

write_fixture(
  "spc_t.rds",
  spc_fixture(
    "spc_t.rds",
    data = spc_g,
    keys = "key",
    numerators = "g",
    spc_settings = list(chart_type = "t"),
    qic_df = qic(spc_g$key, spc_g$g, chart = "t", return.data = TRUE)
  )
)

# xbar + s from raw subgroup data
raw_subgroups <- do.call(rbind, lapply(1:20, function(k) {
  data.frame(key = k, meas = stats::rnorm(5, mean = 10 + sin(k / 3), sd = 1))
}))
agg_mean <- stats::aggregate(meas ~ key, raw_subgroups, mean)
agg_sd <- stats::aggregate(meas ~ key, raw_subgroups, stats::sd)
agg_n <- stats::aggregate(meas ~ key, raw_subgroups, length)
spc_xbar_input <- data.frame(
  key = agg_mean$key,
  mean = agg_mean$meas,
  sd = agg_sd$meas,
  n = agg_n$meas
)

write_fixture(
  "spc_xbar.rds",
  spc_fixture(
    "spc_xbar.rds",
    data = spc_xbar_input,
    keys = "key",
    numerators = "mean",
    denominators = "n",
    xbar_sds = "sd",
    spc_settings = list(chart_type = "xbar"),
    qic_df = qic(raw_subgroups$key, raw_subgroups$meas, chart = "xbar", return.data = TRUE)
  )
)

write_fixture(
  "spc_s.rds",
  spc_fixture(
    "spc_s.rds",
    data = spc_xbar_input,
    keys = "key",
    numerators = "sd",
    denominators = "n",
    spc_settings = list(chart_type = "s"),
    qic_df = qic(raw_subgroups$key, raw_subgroups$meas, chart = "s", return.data = TRUE)
  )
)

# --- Funnel fixtures ---

normalize_funnel_funnelplotr <- function(fp, multiplier, adjusted, data_type) {
  ad <- fp$aggregated_data
  ad$group <- as.character(ad$group)

  # Match controlcharts:
  # - PR/RC: target is overall (sum numerator / sum denominator), scaled
  # - SR: target is 1 (scaled)
  target <- if (identical(data_type, "SR")) {
    multiplier * 1
  } else {
    multiplier * (sum(as.numeric(ad$numerator)) / sum(as.numeric(ad$denominator)))
  }

  out <- data.frame(
    denominator = as.numeric(ad$denominator),
    group = ad$group,
    numerator = as.numeric(ad$numerator),
    value = multiplier * (as.numeric(ad$numerator) / as.numeric(ad$denominator)),
    target = rep(target, nrow(ad))
  )

  if (adjusted) {
    out$ll95 <- as.numeric(ad$OD95LCL)
    out$ul95 <- as.numeric(ad$OD95UCL)
    out$ll99 <- as.numeric(ad$OD99LCL)
    out$ul99 <- as.numeric(ad$OD99UCL)
  } else {
    out$ll95 <- as.numeric(ad$LCL95)
    out$ul95 <- as.numeric(ad$UCL95)
    out$ll99 <- as.numeric(ad$LCL99)
    out$ul99 <- as.numeric(ad$UCL99)
  }

  out <- out[order(out$denominator), , drop = FALSE]
  rownames(out) <- NULL
  out
}

normalize_funnel_controlcharts <- function(cc_limits, expected_cols) {
  cc_limits <- cc_limits[order(cc_limits$denominator), , drop = FALSE]
  cc_limits <- normalize_limits_subset(cc_limits, expected_cols)
  rownames(cc_limits) <- NULL
  cc_limits
}

funnel_fixture <- function(name, data, keys, numerators, denominators,
                           funnel_settings,
                           fp_args, multiplier, adjusted) {
  cc_obj <- cc_call_funnel(
    data = data,
    keys = keys,
    numerators = numerators,
    denominators = denominators,
    funnel_settings = funnel_settings
  )

  fp <- do.call(FunnelPlotR::funnel_plot, c(list(.data = data), fp_args))
  expected <- normalize_funnel_funnelplotr(
    fp,
    multiplier = multiplier,
    adjusted = adjusted,
    data_type = fp_args$data_type
  )
  actual <- normalize_funnel_controlcharts(cc_obj$limits, names(expected))

  list(
    meta = list(
      kind = "funnel",
      fixture = name,
      created_utc = format(Sys.time(), tz = "UTC", usetz = TRUE),
      packages = pkg_versions(),
      adjusted = adjusted
    ),
    input = list(
      data = data,
      controlcharts = list(
        keys = keys,
        numerators = numerators,
        denominators = denominators,
        funnel_settings = funnel_settings
      )
    ),
    expected = expected,
    generated_actual = actual
  )
}

plot_cols <- c("#000000", "#000000", "#000000", "#000000")

funnel_pr <- data.frame(
  group = LETTERS[1:12],
  num = c(10, 25, 9, 45, 8, 120, 11, 60, 4, 70, 2, 90),
  den = c(200, 250, 220, 400, 150, 800, 230, 300, 120, 500, 80, 600)
)

write_fixture(
  "funnel_PR_od_no.rds",
  funnel_fixture(
    "funnel_PR_od_no.rds",
    data = funnel_pr,
    keys = "group",
    numerators = "num",
    denominators = "den",
    funnel_settings = list(chart_type = "PR", od_adjust = "no", multiplier = 100),
    fp_args = list(
      numerator = as_name("num"),
      denominator = as_name("den"),
      group = as_name("group"),
      data_type = "PR",
      multiplier = 100,
      OD_adjust = FALSE,
      draw_unadjusted = TRUE,
      draw_adjusted = FALSE,
      plot_cols = plot_cols
    ),
    multiplier = 100,
    adjusted = FALSE
  )
)

write_fixture(
  "funnel_PR_od_yes.rds",
  funnel_fixture(
    "funnel_PR_od_yes.rds",
    data = funnel_pr,
    keys = "group",
    numerators = "num",
    denominators = "den",
    funnel_settings = list(chart_type = "PR", od_adjust = "yes", multiplier = 100),
    fp_args = list(
      numerator = as_name("num"),
      denominator = as_name("den"),
      group = as_name("group"),
      data_type = "PR",
      multiplier = 100,
      OD_adjust = TRUE,
      draw_unadjusted = FALSE,
      draw_adjusted = TRUE,
      plot_cols = plot_cols
    ),
    multiplier = 100,
    adjusted = TRUE
  )
)

funnel_sr <- data.frame(
  group = LETTERS[1:12],
  obs = c(12, 8, 15, 10, 9, 20, 30, 5, 18, 22, 4, 27),
  exp = c(10, 10, 10, 10, 10, 10, 12, 8, 9, 11, 7, 10)
)

write_fixture(
  "funnel_SR_od_no.rds",
  funnel_fixture(
    "funnel_SR_od_no.rds",
    data = funnel_sr,
    keys = "group",
    numerators = "obs",
    denominators = "exp",
    funnel_settings = list(chart_type = "SR", od_adjust = "no", multiplier = 1),
    fp_args = list(
      numerator = as_name("obs"),
      denominator = as_name("exp"),
      group = as_name("group"),
      data_type = "SR",
      multiplier = 1,
      OD_adjust = FALSE,
      draw_unadjusted = TRUE,
      draw_adjusted = FALSE,
      plot_cols = plot_cols
    ),
    multiplier = 1,
    adjusted = FALSE
  )
)

write_fixture(
  "funnel_SR_od_yes.rds",
  funnel_fixture(
    "funnel_SR_od_yes.rds",
    data = funnel_sr,
    keys = "group",
    numerators = "obs",
    denominators = "exp",
    funnel_settings = list(chart_type = "SR", od_adjust = "yes", multiplier = 1),
    fp_args = list(
      numerator = as_name("obs"),
      denominator = as_name("exp"),
      group = as_name("group"),
      data_type = "SR",
      multiplier = 1,
      OD_adjust = TRUE,
      draw_unadjusted = FALSE,
      draw_adjusted = TRUE,
      plot_cols = plot_cols
    ),
    multiplier = 1,
    adjusted = TRUE
  )
)

funnel_rc <- data.frame(
  group = LETTERS[1:12],
  num = c(12, 8, 15, 10, 9, 20, 35, 6, 18, 25, 5, 28),
  den = c(1000, 900, 1100, 1050, 950, 2000, 750, 500, 1200, 1800, 400, 1600)
)

write_fixture(
  "funnel_RC_od_no.rds",
  funnel_fixture(
    "funnel_RC_od_no.rds",
    data = funnel_rc,
    keys = "group",
    numerators = "num",
    denominators = "den",
    funnel_settings = list(chart_type = "RC", od_adjust = "no", multiplier = 1),
    fp_args = list(
      numerator = as_name("num"),
      denominator = as_name("den"),
      group = as_name("group"),
      data_type = "RC",
      multiplier = 1,
      OD_adjust = FALSE,
      draw_unadjusted = TRUE,
      draw_adjusted = FALSE,
      plot_cols = plot_cols
    ),
    multiplier = 1,
    adjusted = FALSE
  )
)

write_fixture(
  "funnel_RC_od_yes.rds",
  funnel_fixture(
    "funnel_RC_od_yes.rds",
    data = funnel_rc,
    keys = "group",
    numerators = "num",
    denominators = "den",
    funnel_settings = list(chart_type = "RC", od_adjust = "yes", multiplier = 1),
    fp_args = list(
      numerator = as_name("num"),
      denominator = as_name("den"),
      group = as_name("group"),
      data_type = "RC",
      multiplier = 1,
      OD_adjust = TRUE,
      draw_unadjusted = FALSE,
      draw_adjusted = TRUE,
      plot_cols = plot_cols
    ),
    multiplier = 1,
    adjusted = TRUE
  )
)

message("Done.")
