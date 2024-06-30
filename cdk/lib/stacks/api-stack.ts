import { join } from 'path';
import { homedir } from 'os';
import { BundlingOutput, Duration, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Code, Function, FunctionUrlAuthType, HttpMethod, Runtime } from 'aws-cdk-lib/aws-lambda';

interface ApiStackProps extends StackProps {
}

export class ApiStack extends Stack {

  constructor(scope: Construct, id: string, props: ApiStackProps) {
    super(scope, id, props);

    const demoLambda = new Function(this, 'DemoLambda', {
      runtime: Runtime.JAVA_17,
      code: Code.fromAsset(join(__dirname, '../../../'), {
        bundling: {
          image: Runtime.JAVA_17.bundlingImage,
          user: 'root',
          command: [
            "/bin/sh",
            "-c",
            "mvn clean install && cp /asset-input/target/demo-cdk-lambda-java-0.0.1.jar /asset-output/"
          ],
          // NOTE: Can mount local .m2 repo to avoid re-downloading all the dependencies
          // volumes: [
          //   {
          //     hostPath: join(homedir(), '.m2'),
          //     containerPath: '/root/.m2/'
          //   }
          // ],
          outputType: BundlingOutput.ARCHIVED
        }
      }),
      handler: 'com.cgtfarmer.demo.Handler',
      environment: {
        TEST_VALUE: 'TEST',
      },
      memorySize: 1024,
      timeout: Duration.seconds(7),
    });

    const lambdaFunctionUrl = demoLambda.addFunctionUrl({
      authType: FunctionUrlAuthType.NONE,
      cors: {
        allowedOrigins: ['*'],
        allowedHeaders: ['Authorization'],
        allowedMethods: [
          HttpMethod.ALL,
          // HttpMethod.GET,
          // HttpMethod.HEAD,
          // HttpMethod.OPTIONS,
          // HttpMethod.POST,
          // HttpMethod.DELETE,
          // HttpMethod.PUT,
          // HttpMethod.PATCH,
        ],
        maxAge: Duration.days(1),
      }
    });
  }
}
