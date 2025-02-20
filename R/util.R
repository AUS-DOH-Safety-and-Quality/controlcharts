values_entry <- function(name, values) {
  roles <- list(val = values)
  names(roles) <- name
  list(
    source = list(roles = roles),
    values = values
  )
}
