const baseApiURL = "http://127.0.0.1:3000";
enum ApiPath {
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
  static async getCars(params?: CarsRequestParams): Promise<Car[]> {
    let url = `${baseApiURL}/${ApiPath.GARAGE}`;
    if (params !== undefined) {
      const queryParams = Object.entries(params)
        .map((param) => `_${param[0]}=${param[1]}`)
        .join("&");
      url = `${url}?${queryParams}`;
    }

    const response = await fetch(url, {
      method: "GET",
    });
    return response.json();
  }

  static async getCar(id: number): Promise<Car> {
    const response = await fetch(`${baseApiURL}/${ApiPath.GARAGE}/${id}`, {
      method: "GET",
    });
    return response.json();
  }

  static async createCar(carData: Pick<Car, "name" | "color">): Promise<Car> {
    const response = await fetch(`${baseApiURL}/${ApiPath.GARAGE}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(carData),
    });
    return response.json();
  }

  static async deleteCar(id: number): Promise<void> {
    await fetch(`${baseApiURL}/${ApiPath.GARAGE}/${id}`, {
      method: "DELETE",
    });
  }

  static async updateCar(
    id: number,
    carData: Pick<Car, "name" | "color">,
  ): Promise<Car> {
    const response = await fetch(`${baseApiURL}/${ApiPath.GARAGE}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(carData),
    });
    return response.json();
  }

  static async engineStart(id: number): Promise<EngineResp> {
    const response = await fetch(
      `${baseApiURL}/${ApiPath.ENGINE}?id=${id}&status=${EngineStatus.STARTED}`,
      { method: "PATCH" },
    );
    return response.json();
  }

  static async engineStop(id: number): Promise<EngineResp> {
    const response = await fetch(
      `${baseApiURL}/${ApiPath.ENGINE}?id=${id}&status=${EngineStatus.STOPPED}`,
      { method: "PATCH" },
    );
    return response.json();
  }

  static async engineDrive(id: number): Promise<SuccessResp> {
    const response = await fetch(
      `${baseApiURL}/${ApiPath.ENGINE}?id=${id}&status=${EngineStatus.DRIVE}`,
      { method: "PATCH" },
    );
    return response.json();
  }

  static async getWinners(params?: WinnersRequestParams): Promise<Winner[]> {
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
    return response.json();
  }

  static async getWinner(id: number): Promise<Winner> {
    const response = await fetch(`${baseApiURL}/${ApiPath.WINNERS}/${id}`, {
      method: "GET",
    });
    return response.json();
  }

  static async createWinner(winnerData: Winner): Promise<Winner> {
    const response = await fetch(`${baseApiURL}/${ApiPath.WINNERS}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(winnerData),
    });
    return response.json();
  }

  static async deleteWinner(id: number): Promise<void> {
    await fetch(`${baseApiURL}/${ApiPath.WINNERS}/${id}`, {
      method: "DELETE",
    });
  }

  static async updateWinner(
    id: number,
    winnerData: Pick<Winner, "time" | "wins">,
  ): Promise<Winner> {
    const response = await fetch(`${baseApiURL}/${ApiPath.WINNERS}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(winnerData),
    });
    return response.json();
  }
}
