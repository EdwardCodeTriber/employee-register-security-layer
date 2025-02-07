import { Container, Typography, Link, Grid, IconButton } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

const Footer = () => {
  return (
    <footer style={{ backgroundColor: '#475569', padding: '20px', marginTop: '20px' }}>
      <Container>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="white">Contact Us</Typography>
            <Typography variant="body2" color="white">
              Email: edwardthapelo55@gmail.com
            </Typography>
            <Typography variant="body2" color="white">
              Phone: (+27) 769-7654
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="white">Follow Us</Typography>
            <div>
              <IconButton
                color="inherit"
                component={Link}
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FacebookIcon />
              </IconButton>
              <IconButton
                color="inherit"
                component={Link}
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                style={{ marginLeft: '10px' }}
              >
                <TwitterIcon />
              </IconButton>
              <IconButton
                color="inherit"
                component={Link}
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                style={{ marginLeft: '10px' }}
              >
                <LinkedInIcon />
              </IconButton>
            </div>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="white">About</Typography>
            <Typography variant="body2" color="white">
              Created by Thapelo Somo. All rights reserved.
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </footer>
  );
};

export default Footer;
