import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';

import {LearningProgress, Word} from '../types';
import DataService from '../services/DataService';

const {width} = Dimensions.get('window');

const ProgressScreen: React.FC = () => {
  const [progressData, setProgressData] = useState<LearningProgress[]>([]);
  const [words, setWords] = useState<Word[]>([]);
  const [totalWords, setTotalWords] = useState(0);
  const [masteredWords, setMasteredWords] = useState(0);
  const [averageAccuracy, setAverageAccuracy] = useState(0);

  const dataService = DataService.getInstance();

  useEffect(() => {
    loadProgressData();
  }, []);

  const loadProgressData = async () => {
    try {
      const progress = await dataService.getAllProgress('user1');
      const allWords = await dataService.getAllWords();
      
      setProgressData(progress);
      setWords(allWords);
      setTotalWords(allWords.length);
      
      // Calculate statistics
      const mastered = progress.filter(p => p.masteryLevel >= 80).length;
      setMasteredWords(mastered);
      
      if (progress.length > 0) {
        const totalAccuracy = progress.reduce((sum, p) => {
          return sum + (p.correctCount / p.totalAttempts);
        }, 0);
        setAverageAccuracy(Math.round((totalAccuracy / progress.length) * 100));
      }
    } catch (error) {
      console.error('Error loading progress:', error);
    }
  };

  const getWordById = (id: string): Word | undefined => {
    return words.find(w => w.id === id);
  };

  const getMasteryColor = (level: number): string => {
    if (level >= 80) return '#4CAF50';
    if (level >= 60) return '#FF9800';
    if (level >= 40) return '#FFC107';
    return '#F44336';
  };

  const getMasteryLabel = (level: number): string => {
    if (level >= 80) return '已掌握';
    if (level >= 60) return '熟练';
    if (level >= 40) return '一般';
    return '需练习';
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Statistics Overview */}
        <View style={styles.statsContainer}>
          <Text style={styles.title}>学习统计</Text>
          
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Icon name="book" size={40} color="#2196F3" />
              <Text style={styles.statNumber}>{totalWords}</Text>
              <Text style={styles.statLabel}>总词汇</Text>
            </View>
            
            <View style={styles.statCard}>
              <Icon name="check-circle" size={40} color="#4CAF50" />
              <Text style={styles.statNumber}>{masteredWords}</Text>
              <Text style={styles.statLabel}>已掌握</Text>
            </View>
            
            <View style={styles.statCard}>
              <Icon name="trending-up" size={40} color="#FF9800" />
              <Text style={styles.statNumber}>{averageAccuracy}%</Text>
              <Text style={styles.statLabel}>平均正确率</Text>
            </View>
            
            <View style={styles.statCard}>
              <Icon name="schedule" size={40} color="#9C27B0" />
              <Text style={styles.statNumber}>{progressData.length}</Text>
              <Text style={styles.statLabel}>已学习</Text>
            </View>
          </View>
        </View>

        {/* Progress Chart */}
        <View style={styles.chartContainer}>
          <Text style={styles.sectionTitle}>掌握程度分布</Text>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressSegment, 
                {
                  width: `${(masteredWords / totalWords) * 100}%`,
                  backgroundColor: '#4CAF50'
                }
              ]} 
            />
            <View 
              style={[
                styles.progressSegment, 
                {
                  width: `${((progressData.length - masteredWords) / totalWords) * 100}%`,
                  backgroundColor: '#FF9800'
                }
              ]} 
            />
          </View>
          <View style={styles.progressLegend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, {backgroundColor: '#4CAF50'}]} />
              <Text style={styles.legendText}>已掌握 ({masteredWords})</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, {backgroundColor: '#FF9800'}]} />
              <Text style={styles.legendText}>学习中 ({progressData.length - masteredWords})</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, {backgroundColor: '#E0E0E0'}]} />
              <Text style={styles.legendText}>未学习 ({totalWords - progressData.length})</Text>
            </View>
          </View>
        </View>

        {/* Detailed Progress List */}
        <View style={styles.detailContainer}>
          <Text style={styles.sectionTitle}>详细进度</Text>
          {progressData.length === 0 ? (
            <View style={styles.emptyState}>
              <Icon name="school" size={60} color="#ccc" />
              <Text style={styles.emptyText}>还没有学习记录</Text>
              <Text style={styles.emptySubtext}>开始学习识字来查看进度吧！</Text>
            </View>
          ) : (
            progressData
              .sort((a, b) => b.masteryLevel - a.masteryLevel)
              .map((progress) => {
                const word = getWordById(progress.wordId);
                if (!word) return null;

                return (
                  <View key={progress.wordId} style={styles.progressItem}>
                    <View style={styles.wordInfo}>
                      <Text style={styles.wordCharacter}>{word.character}</Text>
                      <View style={styles.wordDetails}>
                        <Text style={styles.wordPinyin}>{word.pinyin}</Text>
                        <Text style={styles.wordMeaning}>{word.meaning}</Text>
                      </View>
                    </View>
                    
                    <View style={styles.progressInfo}>
                      <View style={styles.masteryContainer}>
                        <Text style={[
                          styles.masteryLevel,
                          {color: getMasteryColor(progress.masteryLevel)}
                        ]}>
                          {progress.masteryLevel}%
                        </Text>
                        <Text style={[
                          styles.masteryLabel,
                          {color: getMasteryColor(progress.masteryLevel)}
                        ]}>
                          {getMasteryLabel(progress.masteryLevel)}
                        </Text>
                      </View>
                      
                      <Text style={styles.attempts}>
                        {progress.correctCount}/{progress.totalAttempts} 次正确
                      </Text>
                      
                      <Text style={styles.lastStudied}>
                        最后学习: {new Date(progress.lastStudied).toLocaleDateString()}
                      </Text>
                    </View>
                  </View>
                );
              })
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionContainer}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={loadProgressData}>
            <Icon name="refresh" size={24} color="white" />
            <Text style={styles.actionButtonText}>刷新数据</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  statsContainer: {
    marginBottom: 30,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    width: (width - 60) / 2,
    marginBottom: 15,
    elevation: 3,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  chartContainer: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginBottom: 30,
    elevation: 3,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  progressBar: {
    height: 20,
    backgroundColor: '#E0E0E0',
    borderRadius: 10,
    flexDirection: 'row',
    overflow: 'hidden',
    marginBottom: 15,
  },
  progressSegment: {
    height: '100%',
  },
  progressLegend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    fontSize: 12,
    color: '#666',
  },
  detailContainer: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginBottom: 30,
    elevation: 3,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginTop: 15,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 5,
  },
  progressItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  wordInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  wordCharacter: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 15,
  },
  wordDetails: {
    flex: 1,
  },
  wordPinyin: {
    fontSize: 16,
    color: '#e65100',
    fontWeight: '600',
  },
  wordMeaning: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  progressInfo: {
    alignItems: 'flex-end',
  },
  masteryContainer: {
    alignItems: 'center',
    marginBottom: 5,
  },
  masteryLevel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  masteryLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  attempts: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  lastStudied: {
    fontSize: 10,
    color: '#999',
  },
  actionContainer: {
    alignItems: 'center',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2196F3',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    elevation: 3,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

export default ProgressScreen;
