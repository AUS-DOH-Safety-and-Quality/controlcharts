spc_default_settings <- function(group = NULL) {
  # Defaults loaded from JS as part of .onLoad in zzz.R
  if (is.null(group)) {
    return(.spc_default_settings_internal)
  }
  if (!(group %in% names(.spc_default_settings_internal))) {
    stop("'", group, "' is not a valid settings group! Valid options are: ", paste0(names(.spc_default_settings_internal), collapse = ', '))
  }
  .spc_default_settings_internal[[group]]
}
