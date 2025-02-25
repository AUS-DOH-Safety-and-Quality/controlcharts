values_entry <- function(name, values) {
  roles <- list(dummy = TRUE)
  names(roles) <- name
  list(
    list(
      source = list(roles = roles),
      values = values
    )
  )
}
