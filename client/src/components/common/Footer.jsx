import React from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  Divider,
  IconButton,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Facebook,
  Twitter,
  Instagram,
  LinkedIn,
  LocalHospital,
  Phone,
  Email,
  LocationOn,
  Accessibility,
  MedicalServices,
  Schedule
} from '@mui/icons-material';

const Footer = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        py: 6,
        mt: 'auto'
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Healthcare Logo and Description */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <LocalHospital sx={{ fontSize: 40, mr: 1 }} />
              <Typography variant="h5" component="div">
                HealthCare+
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Your trusted partner in health and wellness. Providing quality care since 2010.
            </Typography>
            <Box sx={{ mt: 2 }}>
              <IconButton aria-label="Facebook" color="inherit">
                <Facebook />
              </IconButton>
              <IconButton aria-label="Twitter" color="inherit">
                <Twitter />
              </IconButton>
              <IconButton aria-label="Instagram" color="inherit">
                <Instagram />
              </IconButton>
              <IconButton aria-label="LinkedIn" color="inherit">
                <LinkedIn />
              </IconButton>
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={6} md={2}>
            <Typography variant="h6" gutterBottom>
              Quick Links
            </Typography>
            <Link href="/doctors" color="inherit" underline="hover" display="block" mb={1}>
              <MedicalServices sx={{ verticalAlign: 'middle', mr: 1 }} />
              Find a Doctor
            </Link>
            <Link href="/appointments" color="inherit" underline="hover" display="block" mb={1}>
              <Schedule sx={{ verticalAlign: 'middle', mr: 1 }} />
              Book Appointment
            </Link>
            <Link href="/pharmacy" color="inherit" underline="hover" display="block" mb={1}>
              <LocalHospital sx={{ verticalAlign: 'middle', mr: 1 }} />
              Pharmacy
            </Link>
            <Link href="/services" color="inherit" underline="hover" display="block" mb={1}>
              <MedicalServices sx={{ verticalAlign: 'middle', mr: 1 }} />
              Services
            </Link>
          </Grid>

          {/* Patient Resources */}
          <Grid item xs={6} md={2}>
            <Typography variant="h6" gutterBottom>
              Resources
            </Typography>
            <Link href="/faq" color="inherit" underline="hover" display="block" mb={1}>
              FAQs
            </Link>
            <Link href="/blog" color="inherit" underline="hover" display="block" mb={1}>
              Health Blog
            </Link>
            <Link href="/privacy" color="inherit" underline="hover" display="block" mb={1}>
              Privacy Policy
            </Link>
            <Link href="/terms" color="inherit" underline="hover" display="block" mb={1}>
              Terms of Service
            </Link>
          </Grid>

          {/* Contact Information */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              Contact Us
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <LocationOn sx={{ mr: 2 }} />
              <Typography>
                123 Medical Drive, Health City, HC 12345
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Phone sx={{ mr: 2 }} />
              <Typography>
                (123) 456-7890
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Email sx={{ mr: 2 }} />
              <Typography>
                contact@healthcareplus.com
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Accessibility sx={{ mr: 2 }} />
              <Typography>
                24/7 Emergency Support
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, backgroundColor: 'rgba(255,255,255,0.2)' }} />

        <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between' }}>
          <Typography variant="body2">
            © {new Date().getFullYear()} HealthCare+. All rights reserved.
          </Typography>
          <Box sx={{ mt: isMobile ? 2 : 0 }}>
            <Link href="/sitemap" color="inherit" underline="hover" sx={{ mr: 2 }}>
              Sitemap
            </Link>
            <Link href="/accessibility" color="inherit" underline="hover" sx={{ mr: 2 }}>
              Accessibility
            </Link>
            <Link href="/careers" color="inherit" underline="hover">
              Careers
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;