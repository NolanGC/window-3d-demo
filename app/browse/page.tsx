"use client";
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';// Import required components from UI kit
import { Card } from '@/components/ui/card';
import postgres from "postgres";

const GridPage = () => {
    const [items, setItems] = useState([]);
    const [limit, setLimit] = useState(9);

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