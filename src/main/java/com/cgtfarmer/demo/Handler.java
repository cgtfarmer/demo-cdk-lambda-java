// Runtime: Java 17

package com.cgtfarmer.demo;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.LambdaLogger;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.amazonaws.services.lambda.runtime.events.LambdaDestinationEvent;
import java.util.Map;

/**
 * Lambda Handler.
 *
 * Note: RequestHandler<X, Y>
 *   X = event type
 *   Y = return type
 */
public class Handler implements RequestHandler<LambdaDestinationEvent, Map<String, String>>{

  @Override
  public Map<String, String> handleRequest(LambdaDestinationEvent event, Context context) {
    LambdaLogger logger = context.getLogger();

    String testEnvVar = System.getenv("TEST_VALUE");

    logger.log("Env var: " + testEnvVar);
    logger.log(event.toString());

    Map<String, String> response = Map.of(
      "msg", "Hello, world!"
    );

    logger.log(response.toString());
    return response;
  }
}
