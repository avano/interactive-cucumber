package io.github.mmuzikar.interactive.cucumber.agent.utils

import io.github.mmuzikar.interactive.cucumber.api.ISuggestionProvider


class NoopSuggestionProvider implements ISuggestionProvider{
    List<Object> provide(String step) {
        return Collections.emptyList()
    }
}
