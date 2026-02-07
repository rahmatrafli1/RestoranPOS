import React from 'react';
import { Container, Typography, Box, Paper } from '@mui/material';

function Dashboard() {
    return (
        <Container maxWidth="lg">
            <Box sx={{ my: 4 }}>
                <Typography variant="h3" component="h1" gutterBottom>
                    RestoranPOS Dashboard
                </Typography>
                <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
                    <Typography variant="h5" gutterBottom>
                        Selamat Datang to RestoranPOS
                    </Typography>
                    <Typography variant="body1">
                        Ini adalah dashboard utama aplikasi RestoranPOS Anda. Gunakan menu navigasi untuk mengakses berbagai fitur seperti manajemen menu, pesanan, dan laporan.
                    </Typography>
                </Paper>
            </Box>
        </Container>
    );
}

export default Dashboard;
