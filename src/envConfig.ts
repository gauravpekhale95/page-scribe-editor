export class EnvConfig {
    ORCHESTRATOR_BASE_URL!: string;
    OKTA_REDIRECT_URI!: string;
    OKTA_APP_ID!: string;
    OKTA_BASE_URL!: string;
    TASK_CENTER_BASE_URL!: string;

    constructor() {
        const appEnv = import.meta.env.VITE_APP_ENV;
        if (appEnv === 'dev') {
            console.log('Setting up Dev Config');
            this.setupDevConfig();
        } else if (appEnv === 'qa') {
            this.setupQaConfig();
        } else if (appEnv === 'prod') {
            this.setupProdConfig();
        } else {
            console.error('Invalid Environment:', appEnv);
            process.exit(1);
        }
    }
    /**
     * Setup the configuration for the particular environment
     * Note : All Key should be in UpperCase
     */
    setupDevConfig() {
        this.ORCHESTRATOR_BASE_URL = "https://dev-document-ai-orchestrator.exprealty.com";
        this.TASK_CENTER_BASE_URL = "https://staging-tc.exprealty.com";
        this.OKTA_BASE_URL = 'https://exprealty.oktapreview.com';
        this.OKTA_REDIRECT_URI = 'https://dev-document-ai.exprealty.com/redirect';
        this.OKTA_APP_ID = '0oa268b9dhxaIQcIe0h8';
    }
    setupQaConfig() {
        this.ORCHESTRATOR_BASE_URL = "https://qa-document-ai-orchestrator.exprealty.com";
        this.TASK_CENTER_BASE_URL = "https://test-tc.exprealty.com";
        this.OKTA_BASE_URL = 'https://exprealty.oktapreview.com';
        this.OKTA_REDIRECT_URI = 'https://qa-document-ai.exprealty.com/redirect';
        this.OKTA_APP_ID = '0oa268b9dhxaIQcIe0h8';
    }
    setupProdConfig() {
        this.ORCHESTRATOR_BASE_URL = "https://document-ai-orchestrator.exprealty.com";
        this.TASK_CENTER_BASE_URL = "https://tc.exprealty.com";
        this.OKTA_BASE_URL = 'https://expi.okta.com';
        this.OKTA_REDIRECT_URI = 'https://document-ai-ui.exprealty.com/redirect';
        this.OKTA_APP_ID = '0oaig41u6bhZPDRVJ697';
    }
     /**
        * This is Object for all the api endpoints.
        * Can be used for all api calls including third party api calls.
        * */
     endpoints = {
        oktaAuthEndpoint : "/oauth2/v1/authorize",
        oktaIssuerEndpoint : "/oauth2/default",
        oktaTokenEndpoint : "/oauth2/v1/token",
        getAllTransactionalData: "/transaction/getAllTransactionalData",
        getDataByUId:"/common/getDataByUId",
        getUserDetailsUsingToken:"/transaction/getUserDetails",
        getmetedata :"/transaction/getMetadataForEachDocument",
        getDocumentForChecklist : "/transaction/getDocumentForChecklist",
        getDocumentURL : "/transaction/getDocumentURL",
        getTransactionalInformation : "/transaction/getTransactionalInformation",
        saveComment: "/transaction/saveComment",
        closeDocument: "/transaction/closeDocument",
        getChecklistCount: "/analytics/getChecklistCount",
        getChecklistsValidationResult: "/analytics/getChecklistsValidationResult",
        getUsers: "/analytics/getAssignee",
        getchecklistItemsReport : "analytics/getchecklistItemsReport",
        reProcessDocument: "/transaction/reProcessDocument",
        getPropertyAddress: "/analytics/getAllPropertyAddress",
        getChecklistExport: "/analytics/getChecklistExport",
    }
    // Global variables / Constants
    globalVariables={
        developers: ["gaurav.pekhale@exprealty.net", "lalit.pawar@exprealty.net", "prince.mahato@exprealty.net", "sakshi.sapkale@exprealty.net"],
    }
}

