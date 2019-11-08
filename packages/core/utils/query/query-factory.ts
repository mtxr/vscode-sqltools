const queryFactory = <P>(pieces: TemplateStringsArray, ...placeholders: (string | number | ((fnArgs: Partial<P>) => any))[]) => {
  return (params: Partial<P> = {}) =>
    pieces
      .reduce((q, piece, index) => {
        const ph = placeholders[index] || '';
        return q + piece.replace(/\r?\n\s+/g, ' ') + (typeof ph !== 'function' ? ph : ph(params));
      }, '')
      .trim();
};

export default queryFactory;