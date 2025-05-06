import { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  FlatList, 
  ActivityIndicator,
  Dimensions,
  TouchableOpacity,
  Alert 
} from 'react-native';
import { auth, db } from '../../config/firebase';
import { collection, query, where, getDocs, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function TransactionScreen() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const userId = auth.currentUser.uid;
      
      // Fetch from documentRequests
      const documentQuery = query(
        collection(db, 'documentRequests'),
        where('userId', '==', userId)
      );

      // Fetch from residencyRequests
      const residencyQuery = query(
        collection(db, 'residencyRequests'),
        where('userId', '==', userId)
      );

      const [documentSnap, residencySnap] = await Promise.all([
        getDocs(documentQuery),
        getDocs(residencyQuery)
      ]);

      const documentRequests = documentSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        type: 'document'
      }));

      const residencyRequests = residencySnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        type: 'residency'
      }));

      // Combine all requests
      const allRequests = [...documentRequests, ...residencyRequests];
      
      // Sort by requestDate if it exists
      allRequests.sort((a, b) => {
        if (!a.requestDate || !b.requestDate) return 0;
        return b.requestDate.seconds - a.requestDate.seconds;
      });

      setRequests(allRequests);
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Not available';
    try {
      // Handle Firebase Timestamp
      if (timestamp.seconds) {
        const date = new Date(timestamp.seconds * 1000);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
      }
      // Handle regular date string
      if (typeof timestamp === 'string') {
        return timestamp;
      }
      return 'Invalid date format';
    } catch (error) {
      return 'Invalid date';
    }
  };

  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'pending': return '#FFA500';
      case 'processing': return '#2196F3';
      case 'accepted': return '#4CAF50';
      case 'declined': return '#FF5252';
      default: return '#757575';
    }
  };

  const handleReceived = async (requestId, type) => {
    try {
      const collectionName = type === 'document' ? 'documentRequests' : 'residencyRequests';
      const requestRef = doc(db, collectionName, requestId);
      
      await updateDoc(requestRef, {
        receivedAt: serverTimestamp()
      });

      Alert.alert(
        'Success',
        'Document has been marked as received',
        [{ text: 'OK' }]
      );

      fetchRequests(); // Refresh the list
    } catch (error) {
      console.error('Error updating received status:', error);
      Alert.alert('Error', 'Failed to update request status. Please try again.');
    }
  };

  const renderRequest = ({ item }) => (
    <View style={styles.requestCard}>
      <View style={styles.cardTop}>
        <View style={styles.iconContainer}>
          <Ionicons 
            name="document-text-outline" 
            size={24} 
            color="#1679ab" 
          />
        </View>
        <View style={styles.requestInfo}>
          <Text style={styles.certificateType}>
            {item.certificateType || 'Unknown Type'}
          </Text>
        </View>
        <View style={[
          styles.statusBadge, 
          { backgroundColor: getStatusColor(item.status) }
        ]}>
          <Ionicons 
            name={item.status === 'Accepted' ? 'checkmark-circle' : 'time'} 
            size={16} 
            color="#fff" 
          />
          <Text style={styles.statusText}>
            {item.status || 'Pending'}
          </Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.requestDetails}>
        <View style={styles.detailRow}>
          <View style={styles.detailLabel}>
            <Ionicons name="person-outline" size={16} color="#666" style={styles.labelIcon} />
            <Text style={styles.labelText}>Name:</Text>
          </View>
          <View style={styles.detailTextContainer}>
            <Text style={styles.detailText}>{item.name}</Text>
          </View>
        </View>

        <View style={styles.detailRow}>
          <View style={styles.detailLabel}>
            <Ionicons name="calendar-outline" size={16} color="#666" style={styles.labelIcon} />
            <Text style={styles.labelText}>Requested:</Text>
          </View>
          <View style={styles.detailTextContainer}>
            <Text style={styles.detailText}>
              {formatDate(item.timestamp || item.requestDate)}
            </Text>
          </View>
        </View>

        {item.status === 'Accepted' && item.acceptedAt && (
          <View style={styles.detailRow}>
            <View style={styles.detailLabel}>
              <Ionicons name="checkmark-circle-outline" size={16} color="#666" style={styles.labelIcon} />
              <Text style={styles.labelText}>Accepted:</Text>
            </View>
            <View style={styles.detailTextContainer}>
              <Text style={[styles.detailText, styles.acceptedTimestamp]}>
                {formatDate(item.acceptedAt)}
              </Text>
            </View>
          </View>
        )}

        <View style={styles.detailRow}>
          <View style={styles.detailLabel}>
            <Ionicons name="information-circle-outline" size={16} color="#666" style={styles.labelIcon} />
            <Text style={styles.labelText}>Purpose:</Text>
          </View>
          <View style={styles.detailTextContainer}>
            <Text style={styles.detailText}>
              {item.purpose || 'Not specified'}
            </Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          {item.status === 'Accepted' && (
            !item.receivedAt ? (
              <TouchableOpacity 
                style={styles.receivedButton}
                onPress={() => handleReceived(item.id, item.type)}
              >
                <Text style={styles.buttonText}>Request Received</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.completedButton}>
                <Text style={styles.buttonText}>Completed</Text>
              </View>
            )
          )}
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#1679ab" />
        </View>
      ) : (
        <FlatList
          data={requests}
          renderItem={renderRequest}
          keyExtractor={item => `${item.type}-${item.id}`}
          contentContainerStyle={styles.listContainer}
          refreshing={loading}
          onRefresh={fetchRequests}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <Ionicons name="documents-outline" size={64} color="#ccc" />
              <Text style={styles.emptyText}>No requests found</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  listContainer: {
    padding: 16,
  },
  requestCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#f0f7fb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  requestInfo: {
    flex: 1,
    marginLeft: 12,
  },
  certificateType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1679ab',
  },
  requestId: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 12,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'center',
    minHeight: 24,
  },
  detailLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 110,
    paddingRight: 8,
  },
  labelIcon: {
    width: 20,
    marginRight: 4,
  },
  labelText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  detailTextContainer: {
    flex: 1,
    paddingLeft: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeStampText: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
    lineHeight: 18,
  },
  acceptedTimestamp: {
    color: '#4CAF50',
    fontWeight: '500',
    fontSize: 12,
    lineHeight: 18,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
  },
  receivedButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 8,
  },
  completedButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});