/* eslint-disable no-console */
const baseApiURL = "http://127.0.0.1:3000";
export enum ApiPath {
  GARAGE = "garage",
  ENGINE = "engine",
  WINNERS = "winners",
}

export enum EngineStatus {
  STARTED = "started",
  STOPPED = "stopped",
  DRIVE = "drive",
}

export interface Car {
  id: number;
  name: string;
  color: string;
}

export interface EngineResp {
  velocity: number;
  distance: number;
}

export interface SuccessResp {
  success: boolean;
}

export interface Winner {
  id: number;
  wins: number;
  time: number;
}

export interface CarsRequestParams {
  page?: number;
  limit?: number;
}

export interface WinnersRequestParams {
  page?: number;
  limit?: number;
  sort?: "id" | "wins" | "time";
  order?: "ASC" | "DESC";
}

export class AsyncRaceApi {
  static async getCars(params?: CarsRequestParams): Promise<Car[] | null> {
    let url = `${baseApiURL}/${ApiPath.GARAGE}`;
    if (params !== undefined) {
      const queryParams = Object.entries(params)
        .map((param) => `_${param[0]}=${param[1]}`)
        .join("&");
      url = `${url}?${queryParams}`;
    }

    try {
      const response = await fetch(url, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error(
          `Network response was not OK. ${response.status} ${response.statusText}`,
        );
      }

      return await response.json();
    } catch (error) {
      console.log("Get Cars request failed.", error);
      return null;
    }
  }

  static async getCar(id: number): Promise<Car | null> {
    try {
      const response = await fetch(`${baseApiURL}/${ApiPath.GARAGE}/${id}`, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error(
          `Network response was not OK. ${response.status} ${response.statusText}`,
        );
      }

      return await response.json();
    } catch (error) {
      console.log("Get Car request failed.", error);
      return null;
    }
  }

  static async createCar(
    carData: Pick<Car, "name" | "color">,
  ): Promise<Car | null> {
    try {
      const response = await fetch(`${baseApiURL}/${ApiPath.GARAGE}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(carData),
      });

      if (!response.ok) {
        throw new Error(
          `Network response was not OK. ${response.status} ${response.statusText}`,
        );
      }

      return await response.json();
    } catch (error) {
      console.log("Create Car request failed.", error);
      return null;
    }
  }

  static async deleteCar(id: number): Promise<void> {
    try {
      const response = await fetch(`${baseApiURL}/${ApiPath.GARAGE}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(
          `Network response was not OK. ${response.status} ${response.statusText}`,
        );
      }
    } catch (error) {
      console.log("Delete Car request failed.", error);
    }
  }

  static async updateCar(
    id: number,
    carData: Pick<Car, "name" | "color">,
  ): Promise<Car | null> {
    try {
      const response = await fetch(`${baseApiURL}/${ApiPath.GARAGE}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(carData),
      });

      if (!response.ok) {
        throw new Error(
          `Network response was not OK. ${response.status} ${response.statusText}`,
        );
      }

      return await response.json();
    } catch (error) {
      console.log("Update Car request failed.", error);
      return null;
    }
  }

  static async getCarsTotalCount(): Promise<string | null> {
    try {
      // Send any _limit count to get X-Total-Count header in response.
      const response = await fetch(
        `${baseApiURL}/${ApiPath.GARAGE}/?_limit=1`,
        {
          method: "GET",
        },
      );

      if (!response.ok) {
        throw new Error(
          `Network response was not OK. ${response.status} ${response.statusText}`,
        );
      }

      return response.headers.get("X-Total-Count");
    } catch (error) {
      console.log("Get Cars Total Count request failed.", error);
      return null;
    }
  }

  static async engineStart(id: number): Promise<EngineResp | null> {
    try {
      const response = await fetch(
        `${baseApiURL}/${ApiPath.ENGINE}?id=${id}&status=${EngineStatus.STARTED}`,
        { method: "PATCH" },
      );

      if (!response.ok) {
        throw new Error(
          `Network response was not OK. ${response.status} ${response.statusText}`,
        );
      }

      return await response.json();
    } catch (error) {
      console.log("Engine Start request failed.", error);
      return null;
    }
  }

  static async engineStop(id: number): Promise<EngineResp | null> {
    try {
      const response = await fetch(
        `${baseApiURL}/${ApiPath.ENGINE}?id=${id}&status=${EngineStatus.STOPPED}`,
        { method: "PATCH" },
      );

      if (!response.ok) {
        switch (response.status) {
          case 400:
            throw new Error(
              `Network response was not OK. ${response.status} Wrong parameters: "id" should be any positive number, "status" should be "started", "stopped" or "drive"`,
            );
            break;
          case 404:
            throw new Error(
              `Network response was not OK. ${response.status} Car with such id was not found in the garage.`,
            );
            break;

          default:
            throw new Error(
              `Network response was not OK. ${response.status} ${response.statusText}`,
            );
            break;
        }
      }

      return await response.json();
    } catch (error) {
      console.log("Engine Stop request failed.", error);
      return null;
    }
  }

  static async engineDrive(id: number): Promise<SuccessResp> {
    try {
      const response = await fetch(
        `${baseApiURL}/${ApiPath.ENGINE}?id=${id}&status=${EngineStatus.DRIVE}`,
        { method: "PATCH" },
      );

      if (!response.ok) {
        switch (response.status) {
          case 400:
            throw new Error(
              `Network response was not OK. ${response.status} Wrong parameters: "id" should be any positive number, "status" should be "started", "stopped" or "drive"`,
            );
            break;
          case 404:
            throw new Error(
              `Network response was not OK. ${response.status} Engine parameters for car with such id was not found in the garage. Have you tried to set engine status to "started" before?`,
            );
            break;
          case 429:
            throw new Error(
              `Network response was not OK. ${response.status} Drive already in progress. You can't run drive for the same car twice while it's not stopped.`,
            );
            break;
          case 500:
            throw new Error(
              `Network response was not OK. ${response.status} Car has been stopped suddenly. It's engine was broken down.`,
            );
            break;

          default:
            throw new Error(
              `Network response was not OK. ${response.status} ${response.statusText}`,
            );
            break;
        }
      }

      return await response.json();
    } catch (error) {
      console.log("Engine Drive request failed.", error);
      throw error;
    }
  }

  static async getWinners(
    params?: WinnersRequestParams,
  ): Promise<Winner[] | null> {
    try {
      let url = `${baseApiURL}/${ApiPath.WINNERS}`;
      if (params !== undefined) {
        const queryParams = Object.entries(params)
          .map((param) => `_${param[0]}=${param[1]}`)
          .join("&");
        url = `${url}?${queryParams}`;
      }

      const response = await fetch(url, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error(
          `Network response was not OK. ${response.status} ${response.statusText}`,
        );
      }

      return await response.json();
    } catch (error) {
      console.log("Get Winners request failed.", error);
      return null;
    }
  }

  static async getWinner(id: number): Promise<Winner | null> {
    try {
      const response = await fetch(`${baseApiURL}/${ApiPath.WINNERS}/${id}`, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error(
          `Network response was not OK. ${response.status} ${response.statusText}`,
        );
      }

      return await response.json();
    } catch (error) {
      console.log("Get Winner request failed.", error);
      return null;
    }
  }

  static async createWinner(winnerData: Winner): Promise<Winner | null> {
    try {
      const response = await fetch(`${baseApiURL}/${ApiPath.WINNERS}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(winnerData),
      });

      if (!response.ok) {
        throw new Error(
          `Network response was not OK. ${response.status} ${response.statusText}`,
        );
      }

      return await response.json();
    } catch (error) {
      console.log("Create Winner request failed.", error);
      return null;
    }
  }

  static async deleteWinner(id: number): Promise<void> {
    try {
      const response = await fetch(`${baseApiURL}/${ApiPath.WINNERS}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(
          `Network response was not OK. ${response.status} ${response.statusText}`,
        );
      }
    } catch (error) {
      console.log("Delete Winner request failed.", error);
    }
  }

  static async updateWinner(
    id: number,
    winnerData: Pick<Winner, "time" | "wins">,
  ): Promise<Winner | null> {
    try {
      const response = await fetch(`${baseApiURL}/${ApiPath.WINNERS}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(winnerData),
      });

      if (!response.ok) {
        throw new Error(
          `Network response was not OK. ${response.status} ${response.statusText}`,
        );
      }

      return await response.json();
    } catch (error) {
      console.log("Update Winner request failed.", error);
      return null;
    }
  }

  static async getWinnersTotalCount(): Promise<string | null> {
    try {
      // Send any _limit count to get X-Total-Count header in response.
      const response = await fetch(
        `${baseApiURL}/${ApiPath.WINNERS}/?_limit=1`,
        {
          method: "GET",
        },
      );

      if (!response.ok) {
        throw new Error(
          `Network response was not OK. ${response.status} ${response.statusText}`,
        );
      }

      return response.headers.get("X-Total-Count");
    } catch (error) {
      console.log("Get Winners Total Count request failed.", error);
      return null;
    }
  }
}
