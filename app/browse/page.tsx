  "use client";
  import React, { useState, useEffect, use } from "react";
  import { Button } from "@/components/ui/button";
  import { Loader } from "lucide-react";
  import { Table, TableCell, TableRow } from "@/components/ui/table";
  import CanvasComponent from "@/components/canvas";
  import { InView } from 'react-intersection-observer';
  import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
  import { useRouter } from "next/navigation";
  import { useMediaQuery } from "react-responsive";
import { ToasterShad } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";

  const Skeleton = () => {
    return (
      <div style={{ 
        width: '100%', 
        height: '100%', 
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ddd', // same background color as CardContent
      }} />
    );
  };

  const GridPage = () => {
    const [items, setItems] = useState([]);
    const [page, setPage] = useState(0);
    const isMobile = useMediaQuery({ maxWidth: 767 });
    const [loading, setLoading] = useState(false);
    const itemsPerPage = 9;
    const itemsPerRow = isMobile ? 1 : 3;
    const router = useRouter();
    const shadToaster = useToast();
    const toastShad = shadToaster.toast;


    const handleInspectClick = (id: any) => {
      router.push(`/?id=${id}`);
    };

    useEffect(() => {
      const fetchItems = async () => {
        setLoading(true);
        try {
          const res = await fetch(
            `/api/get?limit=${itemsPerPage}&offset=${page * itemsPerPage}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          const data = await res.json();
          if (data.length > 0) {
            setItems((prevItems) => {
              const newItems = data.filter(
                (d) => !prevItems.some((item) => item.id === d.id)
              );
              return [...prevItems, ...newItems];
            });
          }
          if(page == 0){
            toastShad({ title: "Objects on this page are interactable!" });
          }
        } catch (error) {
          console.error("Failed to fetch items:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchItems();
    }, [page]);

    const chunkItems = (arr: string | any[], size: number) => {
      const chunkedArr = [];
      for (let i = 0; i < arr.length; i += size) {
        chunkedArr.push(arr.slice(i, i + size));
      }
      return chunkedArr;
    };

    const chunkedItems = chunkItems(items, itemsPerRow);

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          justifyContent: "space-between",
        }}
      >
        <div style={{ overflowY: "auto", flex: "1 0 auto" }}>
          {items.length == 0 ? (
            <div className="flex justify-center items-center w-full h-full">
              <Loader className="spin w-1/7 h-1/7" />
            </div>
          ) : (
            <Table
              style={{
                tableLayout: "fixed",
                width: "100%",
                margin: 0,
                padding: 0,
              }}
            >
              {chunkedItems.map((chunk, rowIndex) => (
                <TableRow
                  key={rowIndex}
                  style={{ display: "flex", height: "1fr" }}
                >
                {chunk.map((item, cellIndex) => (
                  <TableCell
                    key={cellIndex}
                    style={{
                      flex: 1,
                      padding: "0",
                      border: "1px solid #ccc",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Card
                      style={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <CardHeader style={{ textAlign: "center" }}>
                        <CardTitle>{item.prompt}</CardTitle>
                      </CardHeader>
                      <CardContent>
                      <InView rootMargin="100px">
                      {({ inView, ref, entry }) => (
                        <div ref={ref}>
                          {inView ? (
                            <CanvasComponent objectLink={item.data_uri} onScreenshotReady={() => null}/>
                          ) : (
                            <Skeleton /> // Use the Skeleton component as placeholder
                          )}
                        </div>
                      )}
                    </InView>
                      </CardContent>
                      <CardFooter style={{ textAlign: "center" }}>
                        <Button
                          variant="outline"
                          onClick={() => handleInspectClick(item.id)}
                        >
                          🔍
                        </Button>
                      </CardFooter>
                    </Card>
                  </TableCell>
                  ))}
                </TableRow>
              ))}
            </Table>
          )}
        </div>
        <Button
          className="w-full"
          onClick={() => setPage((prev) => prev + 1)}
          style={{ flex: "none", textAlign: "center" }}
        >
          {loading ? <Loader className="spin" /> : "Show more"}
        </Button>
        <ToasterShad></ToasterShad>
      </div>
    );
  };

  export default GridPage;
