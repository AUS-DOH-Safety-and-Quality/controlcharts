values_entry <- function(name, values, objects = NULL) {
  roles <- list(dummy = TRUE)
  names(roles) <- name
  list(
    list(
      source = list(roles = roles),
      values = values,
      objects = objects
    )
  )
}
