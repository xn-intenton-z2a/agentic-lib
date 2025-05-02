# Configuration Documentation

## VERBOSE_MODE Environment Variable

The `VERBOSE_MODE` environment variable controls whether verbose logging is enabled. When `VERBOSE_MODE` is set to "true", log outputs (for example, from the `logInfo` function) will include additional debugging information, such as a `verbose` flag. This setting is useful for troubleshooting and provides more insight during development.

Example:

  export VERBOSE_MODE=true

## VERBOSE_STATS Environment Variable

Similarly, the `VERBOSE_STATS` environment variable enables the output of additional statistics (like global call count and uptime) during certain CLI operations. Set it to "true" to enable these statistics.

Example:

  export VERBOSE_STATS=true

Ensure these variables are set in your environment or defined in your .env file if you require verbose logging and detailed stats.
