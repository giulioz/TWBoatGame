/**
 * SeaDuelServer
 * SeaDuelServer
 *
 * OpenAPI spec version: 1.0.0
 *
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */

export interface OpponentBoardBoardData {
  type: OpponentBoardBoardData.TypeEnum;
}
export namespace OpponentBoardBoardData {
  export type TypeEnum =
    | "Unknown"
    | "Hit"
    | "Miss"
    | "Destroyer"
    | "Submarine"
    | "Battleship"
    | "AircraftCarrier";
  export const TypeEnum = {
    Unknown: "Unknown" as TypeEnum,
    Hit: "Hit" as TypeEnum,
    Miss: "Miss" as TypeEnum,
    Destroyer: "Destroyer" as TypeEnum,
    Submarine: "Submarine" as TypeEnum,
    Battleship: "Battleship" as TypeEnum,
    AircraftCarrier: "AircraftCarrier" as TypeEnum
  };
}
