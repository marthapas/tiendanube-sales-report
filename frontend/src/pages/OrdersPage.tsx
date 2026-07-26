import { Page } from "@nimbus-ds/patterns";
import {
  Box,
  Button,
  Icon,
  Input,
  Table,
  Text,
} from "@nimbus-ds/components";
import { SlidersIcon } from "@nimbus-ds/icons";
import React, { useEffect, useState } from "react";
import { getOrders, Order, Product } from "@/services/orders";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [expandedOrders, setExpandedOrders] = useState<Set<number>>(new Set());

  useEffect(() => {
    async function loadOrders() {
      const data = await getOrders();
      setOrders(data);
    }

    loadOrders();
  }, []);

  const toggleOrder = (id: number) => {
    setExpandedOrders(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const paymentLabels: Record<string, string> = {
    cash: "Efectivo",
    credit_card: "Tarjeta",
    bank_transfer: "Transferencia",
  };

  return (
    <Page>
      <Page.Header
        title="Órdenes"
        subtitle="Listado de órdenes"
      />

      <Page.Body>
        <Box
          display="flex"
          flexDirection="column"
          gap="4"
        >
          <Box
            display="flex"
            flexDirection="column"
            gap="2"
          >
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              gap="2"
            >
              <Box
                display="flex"
                gap="1"
                flex="1"
              >
                <Input.Search
                  placeholder="Buscar órdenes"
                />

                <Button>
                  <Icon
                    color="currentColor"
                    source={<SlidersIcon />}
                  />
                  Filtros
                </Button>
              </Box>

              <Box
                display="flex"
                gap="1"
              >
                <Button>
                  Resumen
                </Button>

                <Button appearance="primary">
                  Exportar
                </Button>
              </Box>
            </Box>

            <Text color="neutral-textLow">
              {orders.length} órdenes
            </Text>
          </Box>

          <Table>
            <>
              <Table.Head>
                <Table.Row backgroundColor="neutral-surface">
                  <Table.Cell as="th">
                    Pedido
                  </Table.Cell>

                  <Table.Cell as="th">
                    Fecha
                  </Table.Cell>

                  <Table.Cell as="th">
                    Cliente
                  </Table.Cell>

                  <Table.Cell
                    as="th"
                    textAlign="right"
                  >
                    Total
                  </Table.Cell>

                  <Table.Cell as="th">
                    Pago
                  </Table.Cell>

                  <Table.Cell as="th">
                    Productos
                  </Table.Cell>

                  <Table.Cell as="th">
                    Notas
                  </Table.Cell>
                </Table.Row>
              </Table.Head>

              <Table.Body>
                {orders.map((order) => (
                  <React.Fragment key={order.id}>
                    <Table.Row>
                      <Table.Cell>
                        <Text
                          color="primary"
                          fontWeight="bold"
                          cursor="pointer"
                        >
                          #{order.number}
                        </Text>
                      </Table.Cell>

                      <Table.Cell>
                        {new Date(order.created_at).toLocaleDateString()}
                      </Table.Cell>

                      <Table.Cell>
                        <Text
                          color="primary"
                          fontWeight="medium"
                          cursor="pointer"
                          whiteSpace="nowrap"
                          overflow="hidden"
                          textOverflow="ellipsis"
                          title={order.customer?.name ?? ""}
                        >
                          {order.customer?.name ?? "-"}
                        </Text>
                      </Table.Cell>

                      <Table.Cell textAlign="right">
                        {new Intl.NumberFormat("es-MX", {
                          style: "currency",
                          currency: "MXN",
                        }).format(Number(order.total))}
                      </Table.Cell>

                      <Table.Cell>
                        <Text fontWeight="medium">
                          {paymentLabels[order.payment_details?.method ?? "-"] ?? "-"}
                        </Text>
                      </Table.Cell>

                      <Table.Cell>
                        <Text
                          cursor="pointer"
                          fontWeight="medium"
                          onClick={() => toggleOrder(order.id)}
                        >
                          {order.products.length}{" "}
                          {expandedOrders.has(order.id) ? "▲" : "▼"}
                        </Text>
                      </Table.Cell>

                      <Table.Cell>
                        <Text
                          overflow="hidden"
                          textOverflow="ellipsis"
                          whiteSpace="nowrap"
                          maxWidth="220px"
                          title={order.owner_note ?? ""}
                        >
                          {order.owner_note ?? "-"}
                        </Text>
                      </Table.Cell>
                    </Table.Row>

                    {expandedOrders.has(order.id) && (
                      <Table.Row>
                        <Table.Cell colSpan={7}>
                          <Box
                            display="flex"
                            flexDirection="column"
                            gap="2"
                            padding="2"
                          >
                            {order.products.map((product: Product) => (
                              <Box
                                key={product.id}
                                display="flex"
                                justifyContent="space-between"
                              >
                                <Text>
                                  {product.quantity} × {product.name}
                                </Text>

                                <Text>
                                  {new Intl.NumberFormat("es-MX", {
                                    style: "currency",
                                    currency: "MXN",
                                  }).format(Number(product.price))}
                                </Text>
                              </Box>
                            ))}
                          </Box>
                        </Table.Cell>
                      </Table.Row>
                    )}
                  </React.Fragment>
                ))}
              </Table.Body>
            </>
          </Table>
        </Box>
      </Page.Body>
    </Page>
  );
}