interface QueryConstructor<P> {
    (params: Partial<P>): string;
    raw?: string;
}
declare const queryFactory: <P>(pieces: TemplateStringsArray, ...placeholders: (string | number | ((fnArgs: Partial<P>) => any))[]) => QueryConstructor<P>;
export default queryFactory;
