/**
 * MCP Server for Sequential Thinking
 */
declare class SequentialThinkingServer {
    private server;
    private storage;
    constructor(storageDir?: string);
    /**
     * Initialize the server by setting up storage.
     */
    initialize(): Promise<void>;
    private setupToolHandlers;
    private processThought;
    private generateSummary;
    private clearHistory;
    private exportSession;
    private importSession;
    /**
     * Start the MCP server
     */
    start(): Promise<void>;
    /**
     * Stop the MCP server
     */
    stop(): Promise<void>;
}
/**
 * Create and start the MCP server
 */
declare function startMcpServer(storageDir?: string): Promise<SequentialThinkingServer>;

export { SequentialThinkingServer, startMcpServer };
