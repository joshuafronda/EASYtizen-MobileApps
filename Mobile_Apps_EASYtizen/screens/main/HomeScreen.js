import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen({ navigation }) {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.mainContent}>
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <View style={styles.titleContainer}>
            <Text style={styles.welcomeText}>Welcome to</Text>
            <View style={styles.brandContainer}>
              <Text style={styles.easyText}>EASY</Text>
              <Text style={styles.tizenText}>tizen!</Text>
            </View>
            <Text style={styles.subtitleText}>
              Serving the Municipality{'\n'}of San Pascual
            </Text>
          </View>
          
          <Image 
            source={require('../../assets/Municipal.png')} 
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        {/* Steps Section */}
        <View style={styles.stepsSection}>
      <View style={styles.stepsTitleContainer}>
      <Text style={[styles.stepsTitle, { color: '#F57C00' }]}>Request</Text>
      <Text style={styles.stepsTitle}>, </Text>
      <Text style={[styles.stepsTitle, { color: '#0288D1' }]}>Track</Text>
      <Text style={styles.stepsTitle}>, </Text>
      <Text style={[styles.stepsTitle, { color: '#388E3C' }]}>Receive</Text>
    </View>
          <Text style={styles.stepsSubtitle}>Step-by-Step Guidance</Text>
          
          <View style={styles.stepsList}>
            <Text style={styles.stepItem}>
              <Text style={styles.stepHighlight}>Request: </Text>
              Submit a document request with just a few taps.
            </Text>
            <Text style={styles.stepItem}>
              <Text style={styles.stepHighlight}>Track: </Text>
              Follow the progress of your request in real-time.
            </Text>
            <Text style={styles.stepItem}>
              <Text style={styles.stepHighlight}>Receive: </Text>
              Get your documents when they're ready for pickup.
            </Text>
          </View>

          <View style={styles.stepsList}>
            <Text style={styles.stepItem}>
              <Text style={styles.stepHighlight}>Note: </Text>
              Some documents fees are required. the exact fee amount varies depending on the document.
            </Text>
          </View>

          <TouchableOpacity 
            style={styles.requestButton}
            onPress={() => navigation.navigate('Request')}
          >
            <Text style={styles.requestButtonText}>Request a Document</Text>
          </TouchableOpacity>
        </View>

        {/* About Section */}
        <View style={styles.aboutSection}>
          <Text style={styles.aboutTitle}>About Us:</Text>
          <Text style={styles.aboutText}>
            San Pascual, officially the Municipality of San Pascual (Tagalog: Bayan ng San Pascual), is a 1st class municipality in the province of Batangas, Philippines.{'\n\n'}
            The municipality of San Pascual There are 29 barangays, which is situated in the Batangas province. Approximately 1.63% of Batangas' total land area, or 50.70 square kilometers or 19.58 square miles, is made up of San Pascual. San Pascual's population was 69,009 as of the 2020 Census.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  mainContent: {
    padding: 20,
  },
  welcomeSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 30,
  },
  titleContainer: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  easyText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1679ab',
  },
  tizenText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ff0a0a',
    fontStyle: 'italic',
  },
  subtitleText: {
    fontSize: 16,
    color: '#333',
    marginTop: 8,
    lineHeight: 24,
  },
  logo: {
    width: 150,
    height: 150,
  },
  stepsSection: {
    marginBottom: 30,
  },
  stepsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
    fontStyle: 'italic',
  },
  stepsSubtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  stepsList: {
    marginBottom: 20,
  },
  stepItem: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    lineHeight: 20,
  },
  stepHighlight: {
    fontWeight: 'bold',
    color: '#333',
  },
  requestButton: {
    backgroundColor: '#1679ab',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  requestButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disclaimer: {
    fontSize: 12,
    color: '#666',
    lineHeight: 18,
  },
  aboutSection: {
    backgroundColor: '#F5F5F5',
    padding: 20,
    borderRadius: 8,
  },
  aboutTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  aboutText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  stepsTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
});