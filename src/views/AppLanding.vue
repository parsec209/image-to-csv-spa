<template>
  <div>
    <b-container class="mt-5">
      <b-container id="landing-image">
        <b-row >
          <b-col>
            <h1 id="description" class="pt-4 pt-md-5 text-center">CSV from document images.</h1>
            <div id="auth-buttons">
              <b-button class="mb-2 auth-button" variant=outline-light size="lg" to="/register">
                Register
              </b-button>
              <br>
              <b-button class="mb-2 auth-button" variant="outline-light" size="lg" to="/login">
                Login
              </b-button>
            </div>
          </b-col>
        </b-row>
      </b-container>
    </b-container>

    <div id="card-section">
      <div class="container py-5">
        <b-card-group deck>
          <b-card class="text-center">
            <template #header>
              <h5>High Quality OCR</h5>
            </template>
            <b-icon icon="file-earmark-text" font-scale="2"></b-icon>
            <br>
            <br>
            <b-card-text>
              <p>
                Uses Google Cloud Vision.
              </p>
                <p>Supports multi-page PDF, TIFF, or GIF files.
              </p>
            </b-card-text>
          </b-card>
          <b-card class="text-center">
            <template #header>
              <h5>Customizable parsers</h5>
            </template>
            <b-card-text>
              <b-icon icon="cloud-arrow-up" font-scale="2" class="mr-1"></b-icon>
              <b-icon icon="gear" font-scale="2"></b-icon>
              <br>
              <br>
              <p>No guesswork on generating the CSV files.</p>
              <p>Setup metadata parsers for recurring docs.</p>
            </b-card-text>
          </b-card>
          <b-card class="text-center">
            <template #header>
              <h5>Open Source</h5>
            </template>
            <b-card-text>
              <b-icon icon="unlock" font-scale="2"></b-icon>
              <br>
              <br>
              <p>View, modify, and contribute to the code.</p>
              <b-button variant="primary" href="https://github.com/parsec209/image-to-csv-api">
                <b-icon icon="github" class="mr-2"></b-icon>View Source
              </b-button>
            </b-card-text>
          </b-card>
        </b-card-group>
      </div>
    </div>
  </div>
</template>


<script>
export default {
  name: 'AppLanding'
}
</script>

<style scoped>
#landing-image {
  background-image: url(../assets/img/desk.jpg);
  background-repeat: no-repeat;
  background-size: contain;
}

@media screen and (max-width: 900px) {
  #description {
    font-size:4vw
  }
}

#description {
  color: white;
}

#auth-buttons {
  margin-top: 60%;
  margin-bottom: 30%;
}
.auth-button {
  width: 33%;
}

#card-section {
  background-color: lightsteelblue;
}
</style>
