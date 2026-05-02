/**
 * Signs short-lived IAM database authentication tokens for Amazon RDS / Aurora.
 *
 * The AWS SDK is imported dynamically so the cost is only paid by users who
 * actually turn on IAM auth.
 */

export interface AwsIamAuthOptions {
  region?: string;
  profile?: string;
}

export interface SignAwsIamTokenParams {
  hostname: string;
  port: number;
  username: string;
  region: string;
  profile?: string;
}

export async function signAwsIamToken(params: SignAwsIamTokenParams): Promise<string> {
  const { Signer } = await import('@aws-sdk/rds-signer');

  let credentials: any;
  if (params.profile) {
    const { fromIni } = await import('@aws-sdk/credential-providers');
    credentials = fromIni({ profile: params.profile });
  }

  const signer = new Signer({
    region: params.region,
    hostname: params.hostname,
    port: params.port,
    username: params.username,
    ...(credentials ? { credentials } : {}),
  });

  return signer.getAuthToken();
}

export function validateIamAuthOptions(
  options: AwsIamAuthOptions,
  poolHas: { ssl: boolean; hostname?: string; port?: number; username?: string }
): void {
  if (!options.region) {
    throw new Error('IAM database authentication requires a region in awsIamOptions.');
  }
  if (!poolHas.ssl) {
    throw new Error(
      'IAM database authentication requires SSL. Enable SSL in mysqlOptions and supply the Amazon RDS CA bundle.'
    );
  }
  if (!poolHas.hostname || !poolHas.port || !poolHas.username) {
    throw new Error('IAM database authentication requires host, port and username to be set.');
  }
}
