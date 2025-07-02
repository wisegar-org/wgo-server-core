/**
 *  @interface IJwtSettings define the jwt-settings json file
 */
export interface IJwtSettings {
    /**
     * @summary DO NOT USE, OR SETUP THE PRIVATE KEY ON CLIENT ENVIRONMENTS 
     **/
    privateKey: string;
    publicKey: string;

}