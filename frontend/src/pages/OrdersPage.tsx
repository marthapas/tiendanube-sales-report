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
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null);

  useEffect(() => {
    async function loadOrders() {
      const data = await getOrders();
      setOrders(data);
    }

    loadOrders();
  }, []);

  const toggleOrder = (id: number) => {
    setExpandedOrder(current =>
        current === id ? null : id
    );
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
                        <Box
                            display="flex"
                            alignItems="center"
                            gap="1"
                            cursor="pointer"
                            onClick={() => toggleOrder(order.id)}
                        >
                            <Text fontWeight="medium">
                                {order.products.length} unid.
                            </Text>
                            <Text>
                              {expandedOrder === order.id ? "▲" : "▼"}
                            </Text>
                        </Box>
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

                    {expandedOrder === order.id && (
                      <Table.Row backgroundColor="neutral-surface">
                          <Table.Cell colSpan={7} padding="0">
                              <Box
                                  padding="4"
                                  display="flex"
                                  flexDirection="column"
                                  gap="3"
                              >

                                  <Table>
                                      <>
                                          <Table.Head>
                                              <Table.Row>
                                                  <Table.Cell as="th">
                                                      Producto
                                                  </Table.Cell>

                                                  <Table.Cell
                                                      as="th"
                                                      textAlign="center"
                                                  >
                                                      Cantidad
                                                  </Table.Cell>

                                                  <Table.Cell
                                                      as="th"
                                                      textAlign="right"
                                                  >
                                                      Precio Unitario
                                                  </Table.Cell>

                                                  <Table.Cell
                                                      as="th"
                                                      textAlign="right"
                                                  >
                                                      Total
                                                  </Table.Cell>
                                              </Table.Row>
                                          </Table.Head>

                                          <Table.Body>

                                              {order.products.map((product: Product) => (
                                                  <Table.Row key={product.id}>
                                                      <Table.Cell>
                                                          <Box
                                                              display="flex"
                                                              flexDirection="column"
                                                              gap="1"
                                                          >
                                                              <Text fontWeight="medium">
                                                                  {product.name}
                                                              </Text>
                                                              {product.barcode && (
                                                                  <Text
                                                                      color="neutral-textLow"
                                                                      fontSize="caption"
                                                                  >
                                                                      {product.barcode}
                                                                  </Text>
                                                              )}
                                                          </Box>
                                                      </Table.Cell>
                                                      <Table.Cell textAlign="center">
                                                          {product.quantity}
                                                      </Table.Cell>
                                                      <Table.Cell textAlign="right">
                                                          {new Intl.NumberFormat(
                                                              "es-MX",
                                                              {
                                                                  style: "currency",
                                                                  currency: "MXN"
                                                              }
                                                          ).format(Number(product.price))}
                                                      </Table.Cell>
                                                      <Table.Cell textAlign="right">
                                                          {new Intl.NumberFormat(
                                                              "es-MX",
                                                              {
                                                                  style: "currency",
                                                                  currency: "MXN"
                                                              }
                                                          ).format(
                                                              Number(product.price) *
                                                              product.quantity
                                                          )}
                                                      </Table.Cell>
                                                  </Table.Row>
                                              ))}
                                          </Table.Body>
                                      </>
                                  </Table>
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