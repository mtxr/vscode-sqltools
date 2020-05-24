interface QueryConstructor<P> {
  (params: Partial<P>): string;
  raw?: string;
}

const queryFactory = <P>(pieces: TemplateStringsArray, ...placeholders: (string | number | ((fnArgs: Partial<P>) => any))[]) => {
  function queryConstructor(params: Partial<P> = {}) {
    return pieces
      .reduce((q, piece, index) => {
        const ph = placeholders[index];
        q += piece.replace(/\r?\n\s+/g, ' ');
        if (typeof ph !== 'undefined') {
          q += (typeof ph !== 'function' ? ph : ph(params));
        }
        return q;
      }, '')
      .trim();
  }

  queryConstructor.raw = pieces
    .reduce((q, piece, index) => {
      const ph = placeholders[index];
      q += piece.replace(/\r?\n\s+/g, ' ');
      if (typeof ph !== 'undefined') {
        q += '${' + ph.toString() + '}';
      }
      return q;
    }, '')
    .trim();

  return queryConstructor as QueryConstructor<P>;
};

export default queryFactory;