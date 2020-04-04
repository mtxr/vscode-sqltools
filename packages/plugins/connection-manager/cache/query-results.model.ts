import Cache from '@sqltools/util/cache';

const queryResultsCache = new Cache('query-results', {
  maxAge: 1*60*1000,
  maxEntries: 50,
});

queryResultsCache.buildKey = ({ connId, resultId, query, requestId }) => `[${connId}][${requestId || query}][${resultId || query}]`;
export default queryResultsCache;
