<?php

$app->get('/[{name}]', function ($request, $response, $args) {
    // Sample log message
    $this->logger->info("India '/' home");

    // Render index view
    return $this->renderer->render($response, 'index.html', $args);
});
