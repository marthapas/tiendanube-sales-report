import { tiendanubeApiClient } from "@config";

class OrdersService {
  async findAll(user_id: number): Promise<any[]> {
    return await tiendanubeApiClient.get(`${user_id}/orders`);
  }
}

export default new OrdersService();