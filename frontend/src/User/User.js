import React from "react";
import {
  Container,
  Grid,
  Typography,
  TextField,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,

} from "@mui/material";
import "./User.css"; // Import the CSS file

const User = () => {
  return (
    <Container className="container">
      <Paper
        elevation={2}
        style={{ padding: "20px" }}
        sx={{ maxWidth: 800, margin: "auto" ,mt:10}}
        className="aggre"
      >
        <Box p={3}>
          <Typography variant="h5" className="titles" align="center">
            கோல்டு பைனான்ஸ்
          </Typography>
          <Typography align="center" className="tit">
            135/5, வேலவன் காம்ப்ளக்ஸ், (M.G.N லாட்ஜ் அருகில்) சேலம் மெயின் ரோடு,
            கொமாரபாளையம் - 638 183, நாமக்கல் Dt
          </Typography>
          <Typography align="center" className="tit">
            காவல்துறை மற்றும் நிறுவனத்திற்கான தங்கம் அடகு / விற்பனை உறுதிமொழி
            பத்திரம்
          </Typography>
          <Typography variant="h6" className="title">
            அனுப்புநர்
          </Typography>
          <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="பெயர்"
                variant="standard"
                fullWidth
                className="textField"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="த / க. பெயர்"
                variant="standard"
                fullWidth
                className="textField"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="தேதி"
                type="date"
                name="date"
                variant="standard"
                fullWidth
                className="textField"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="முகவரி"
                variant="standard"
                fullWidth
                className="textField"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="ஆதார் எண்"
                variant="standard"
                fullWidth
                className="textField"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="மொபைல் எண்"
                variant="standard"
                fullWidth
                className="textField"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="தொழில்"
                variant="standard"
                fullWidth
                className="textField"
              />
            </Grid>
           
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="நகைகடன் எண்: JL"
                variant="standard"
                fullWidth
                className="textField"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="வட்டி விகிதம்"
                   variant="standard"
                fullWidth
                className="textField"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="கால தவணை"
                  variant="standard"
                fullWidth
                className="textField"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="தொகை"
                 variant="standard"
                fullWidth
                className="textField"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="நகை விற்பனை No"
                  variant="standard"
                fullWidth
                className="textField"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="விற்பனை தொகை"
                 variant="standard"
                fullWidth
                className="textField"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="எடை: G.W..... "
                variant="standard"
                fullWidth
                className="textField"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="எடை:  N.W......"
                 variant="standard"
                fullWidth
                className="textField"
              />
            </Grid>
           
          <Grid item xs={12} sm={6}>
          <Typography variant="h6" className="title-1">
            பெறுநர்
          </Typography>
          <Typography className="title-1">
            135/5, வேலவன் காம்ப்ளக்ஸ், (M.G.N லாட்ஜ் அருகில்) சேலம் மெயின் ரோடு,
            கொமாரபாளையம் - 638 183, நாமக்கல் Dt
          </Typography>
            </Grid>
            <Grid item xs={12} sm={6} align="center">
            <Typography variant="h8" className="title-1" >
            உயர்திரு 
          </Typography><br></br>
            <Typography variant="h8" className="title-1">
          காவல் ஆய்வாளர் அவர்கள்,
          </Typography>
          <Typography variant="h8" className="title-1">
          காவல் நிலையம்
          </Typography>
              <TextField
                label=""
                variant="standard"
                fullWidth
                className="textField"
              />
            </Grid>
            <Grid item xs={12} sm={6} >
              <TextField
                label="பிற வங்கியின் பெயர்/ஊர்"
                 variant="standard"
                fullWidth
                className="textField"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="பிற வங்கியில் கட்டிய தொகை"
                 variant="standard"
                fullWidth
                className="textField"
              />
            </Grid>
            <Grid item xs={12} sm={6} >
              <TextField
                label="நகைக்கடன் தொகை"
                 variant="standard"
                fullWidth
                className="textField"
              />
            </Grid>
            <Grid item xs={12} sm={6} >
              <TextField
                label="நகை விற்பனை தொகை"
                 variant="standard"
                fullWidth
                className="textField"
              />
            </Grid>
            <Grid item xs={12} sm={6} >
              <TextField
                label="தங்கத்தின் எடை"
                 variant="standard"
                fullWidth
                className="textField"
              />
            </Grid>
            <Grid item xs={12} sm={6} >
              <TextField
                label="சேவை கட்டணம்"
                variant="standard"
                fullWidth
                className="textField"
              />
            </Grid>
            <Grid item xs={12} >
              <TextField
                label="வாடிக்கையாளரிடம் கொடுத்த தொகை"
                 variant="standard"
                fullWidth
                className="textField"
              />
              <Typography className="title-1"> நான் கொடுத்த ஆவணத்தின் அடிப்படையில் எனது தேவைக்காக தாங்கள்
              கொண்டு வரும் பணத்திற்கு முழு பொறுப்பையும் ஏற்கின்றோம் / றேன்.</Typography>
              <TextField
                label="  வாடிக்கையாளர் கையொப்பம்"
                 variant="standard"
                fullWidth
                className="textField"
              />
            </Grid>
          </Grid>
          <Typography variant="h6" className="title">
            அடகு / விற்பனை விபரம்
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ border: '1px solid black' }}  className="textField">வ.எண்.</TableCell>
                  <TableCell sx={{ border: '1px solid black' }} className="textField">பொருட்களின் விபரம்</TableCell>
                  <TableCell sx={{ border: '1px solid black' }} className="textField">எண்ணிக்கை</TableCell>
                  <TableCell sx={{ border: '1px solid black' }} className="textField">தரம்</TableCell>
                  <TableCell sx={{ border: '1px solid black' }} className="textField">மொத்த ஏடை</TableCell>
                  <TableCell sx={{ border: '1px solid black' }} className="textField">நிகர எடை</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell sx={{ border: '1px solid black' }}>
                    <TextField
                      label=""
                      variant="outlined"
                      fullWidth
                      className="textField"
                    />
                  </TableCell>
                  <TableCell sx={{ border: '1px solid black' }}>
                    <TextField
                      label=""
                      variant="outlined"
                      fullWidth
                      className="textField"
                    />
                  </TableCell>
                  <TableCell sx={{ border: '1px solid black' }}>
                    <TextField
                      label=""
                      variant="outlined"
                      fullWidth
                      className="textField"
                    />
                  </TableCell>
                  <TableCell sx={{ border: '1px solid black' }}> 
                    <TextField
                      label=""
                      variant="outlined"
                      fullWidth
                      className="textField"
                    />
                  </TableCell>
                  <TableCell sx={{ border: '1px solid black' }}>
                    <TextField
                      label=""
                      variant="outlined"
                      fullWidth
                      className="textField"
                    />
                  </TableCell>
                  <TableCell sx={{ border: '1px solid black' }}>
                    <TextField
                      label=""
                      variant="outlined"
                      fullWidth
                      className="textField"
                    />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Paper>

      
     
     
    </Container>
  );
};

export default User;
