import React from 'react';
import { Redirect } from 'expo-router';

const Exit = () => {
    return <Redirect href="/auth" />;
};

export default Exit;