import { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { auth, db } from '../../config/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const userId = auth.currentUser.uid;
      
      // Document Requests Query
      const docQuery = query(
        collection(db, 'documentRequests'),
        where('userId', '==', userId)
      );

      // Residency Requests Query
      const residencyQuery = query(
        collection(db, 'residencyRequests'),
        where('userId', '==', userId)
      );

      const [docSnapshot, residencySnapshot] = await Promise.all([
        getDocs(docQuery),
        getDocs(residencyQuery)
      ]);

      const docNotifs = docSnapshot.docs.map(doc => ({
        id: doc.id,
        title: `${doc.data().certificateType} Request`,
        message: getStatusMessage(
          doc.data().status, 
          doc.data().certificateType, 
          doc.data().name,
          doc.data().acceptedAt
        ),
        status: doc.data().status || 'Pending',
        read: false,
        type: 'document',
        name: doc.data().name,
        requestDate: doc.data().requestDate,
        processedAt: doc.data().processedAt,
        acceptedAt: doc.data().acceptedAt,
        declinedAt: doc.data().declinedAt
      }));

      const residencyNotifs = residencySnapshot.docs.map(doc => ({
        id: doc.id,
        title: `${doc.data().certificateType} Request`,
        message: getStatusMessage(
          doc.data().status, 
          doc.data().certificateType, 
          doc.data().name,
          doc.data().acceptedAt
        ),
        status: doc.data().status || 'Pending',
        read: false,
        type: 'residency',
        name: doc.data().name,
        requestDate: doc.data().requestDate,
        processedAt: doc.data().processedAt,
        acceptedAt: doc.data().acceptedAt,
        declinedAt: doc.data().declinedAt
      }));

      setNotifications([...docNotifs, ...residencyNotifs]);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setLoading(false);
    }
  };

  const getStatusMessage = (status, documentType, name, acceptedAt) => {
    switch(status?.toLowerCase()) {
      case 'pending':
        return `Your ${documentType} request is being reviewed by the barangay officials.`;
      case 'processing':
        return `Your ${documentType} request is now being processed. Please wait for further updates.`;
      case 'accepted':
        return `Your ${documentType} is ready for pick-up at the barangay office. Please bring a your QR Code or Valid ID. 

Some documents fees are required. the exact fee amount varies depending on the document.`;
      case 'declined':
        return `We regret to inform you that your ${documentType} request has been declined. Please check your application for any missing information or errors. `;
      default:
        return `Status update for your ${documentType} request.`;
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Just now';
    try {
      const date = new Date(timestamp.seconds * 1000);
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch (error) {
      return 'Date unavailable';
    }
  };

  const getStatusIcon = (status) => {
    switch(status?.toLowerCase()) {
      case 'pending': return 'document-text-outline';
      case 'processing': return 'document-text-outline';
      case 'accepted': return 'document-text-outline';
      case 'declined': return 'document-text-outline';
      default: return 'document-text-outline';
    }
  };

  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'pending': return '#FFA500';
      case 'processing': return '#2196F3';
      case 'accepted': return '#4CAF50';
      case 'declined': return '#F44336';
      default: return '#757575';
    }
  };

  const getTimeDisplay = (item) => {
    switch(item.status?.toLowerCase()) {
      case 'pending':
        return `${formatDate(item.pendingAt)}`;
      case 'processing':
        return `${formatDate(item.processedAt)}`;
      case 'accepted':
        return `${formatDate(item.acceptedAt)}`;
      case 'declined':
        return `${formatDate(item.declinedAt)}`;
      default:
        return formatDate(item.requestDate);
    }
  };

  const renderNotification = ({ item }) => (
    <TouchableOpacity 
      style={[styles.notificationCard, !item.read && styles.unreadCard]}
      onPress={() => {
        setSelectedNotification(item);
        setShowModal(true);
      }}
    >
      <View style={styles.iconContainer}>
        <Ionicons 
          name={getStatusIcon(item.status)} 
          size={24} 
          color={getStatusColor(item.status)} 
        />
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.titleText}>{item.title}</Text>
        <Text style={styles.messageText}>{item.message}</Text>
        <View style={styles.footerContainer}>
        </View>
        
        <Text style={[
          styles.timeText,
          { color: getStatusColor(item.status) }
        ]}>
          {getTimeDisplay(item)}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const closeModal = () => {
    setShowModal(false);
    setSelectedNotification(null);
  };

  return (
    <View style={styles.container}>
    <View style={styles.header}>
        <Text style={styles.headerText}>Other Updates</Text>
        <Text style={styles.readAllText}>Read all ({notifications.length})</Text>
      </View>
      <FlatList
        data={notifications}
        renderItem={renderNotification}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        refreshing={loading}
        onRefresh={fetchNotifications}
      />

      <Modal
        visible={showModal}
        transparent={true}
        animationType="slide"
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.headerText}>Notification Details</Text>
              <TouchableOpacity onPress={closeModal}>
                <Ionicons name="close" size={24} color="#1679ab" />
              </TouchableOpacity>
            </View>

            {selectedNotification && (
              <ScrollView contentContainerStyle={styles.scrollView}>
                <Text style={styles.message}>{selectedNotification.message}</Text>
                {/* Conditional rendering for accepted requests */}
                {selectedNotification.status.toLowerCase() === 'accepted' && (
                  <>
                    <Text style={styles.details}>Take note:</Text>
                    <Text style={styles.details}>Ensure to pick up this request during office hours, before 5 PM.</Text>
                  </>
                )}
                {selectedNotification.status.toLowerCase() === 'declined' && (
                  <>
                    <Text style={styles.detailss}>Note: Your request has been declined. Please review your application for any unfamiliar names or errors.</Text>
                  </>
                )}
                {selectedNotification.status.toLowerCase() === 'processing' && (
                  <>
                    <Text style={styles.detailss}>Your request is undergoing processing. We will notify you with any updates soon.</Text>
                  </>
                )}
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  listContainer: {
    padding: 15,
  },
  notificationCard: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#',
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#eee',
  },
  unreadCard: {
    backgroundColor: '#f0f8ff',
  },
  iconContainer: {
    marginRight: 15,
    justifyContent: 'center',
  },
  contentContainer: {
    flex: 1,
  },
  titleText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  messageText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    marginTop: 5,
  },
  statusText: {
    color: '#1679ab',
    fontSize: 12,
    fontWeight: '500',
  },
  timeText: {
    fontSize: 12,
    marginTop: 5,
    fontWeight: '500',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 10,
    width: '90%',
    maxHeight: '80%',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  scrollView: {
    paddingBottom: 20,
  },
  closeButton: {
    alignSelf: 'flex-end',
    marginBottom: 10,
  },
  closeButtonText: {
    color: '#1679ab',
    fontSize: 16,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  message: {
    fontSize: 16,
    marginBottom: 10,
    color: '#555',
  },
  details: {
    fontSize: 14,
    marginBottom: 5,
    color: '#1679ab',
    
  },
  detailss: {
    fontSize: 14,
    marginBottom: 5,
    color: '#FF0000',
    
  },
  detailsss: {
    fontSize: 14,
    marginBottom: 5,
    color: '#1679ab',
    
  },
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  headerText: {
    fontSize: 15,
    color: '#333',
  },
  readAllText: {
    fontSize: 15,
    color: '#1679ab',
  },
  noNotificationsText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#888',
  },
  listContainer: {
    paddingBottom: 20,
  },
});