"use client";
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';// Import required components from UI kit
import { Card } from '@/components/ui/card';

const GridPage = () => {
    const [items, setItems] = useState([]);
    const [limit, setLimit] = useState(9);

    useEffect(() => {
        fetchItems();
    }, [limit]);

    const fetchItems = async () => {
        const res = await fetch('/api/items');
        const data = await res.json();
        setItems(data.data.slice(0, limit));
        console.log("fetched items")
        console.log("items",items)
    };

    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            {items.map((item, index) => (
                <Card key={index}>
                </Card>
            ))}
            <Button onClick={() => setLimit(prev => prev + 9)}>Show more</Button>
        </div>
    );
};

export default GridPage;