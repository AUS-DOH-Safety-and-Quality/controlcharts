values_entry <- function(name, values, objects = NULL) {
  roles <- list(dummy = TRUE)
  names(roles) <- name
  type <- list()
  if (name == "key") {
    type <- list(temporal = list(underlyingType = 519))
  }
  list(
    list(
      source = list(
        roles = roles,
        type = type
      ),
      values = values,
      objects = objects
    )
  )
}
