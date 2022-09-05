import { NSDatabase } from '@sqltools/types';

// maps connection id to a map of requestId to results
const retainedQueryResults = new Map<string, Map<string, NSDatabase.IResult>>();

export function retainResults(connId: string, requestId: string, results: NSDatabase.IResult): NSDatabase.IResult {
  let connResults = retainedQueryResults.get(connId);
  if (!connResults) {
    connResults = new Map();
    retainedQueryResults.set(connId, connResults);
  }
  connResults.set(requestId, results);

  return results;
}

export function releaseConnectionResults(connId: string) {
  retainedQueryResults.delete(connId);
}

export function releaseResults(connId: string, requestId: string) {
  const connResults = retainedQueryResults.get(connId);
  if (connResults) {
    connResults.delete(requestId);
  }
}

export function getRetainedResults(connId: string, requestId: string) {
  const connResults = retainedQueryResults.get(connId);
  if (connResults) {
    return connResults.get(requestId);
  }

  return undefined;
}
