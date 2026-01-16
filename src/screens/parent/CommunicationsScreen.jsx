import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const CommunicationsScreen = () => {
  // Mock data - Replace with your actual data
  const conversations = [
    {
      id: 1,
      name: "المدرسة الابتدائية",
      lastMessage: "اجتماع أولياء الأمور غداً الساعة 4 عصراً",
      time: "10:30 ص",
      unread: 2,
      icon: "school",
    },
    {
      id: 2,
      name: "معلّمة الرياضيات",
      lastMessage: "الواجب المنزلي لليوم",
      time: "أمس",
      unread: 0,
      icon: "calculator",
    },
    {
      id: 3,
      name: "معلّمة اللغة العربية",
      lastMessage: "مشاركة ممتازة في الصف اليوم",
      time: "٢٤ نوفمبر",
      unread: 1,
      icon: "book-open-variant",
    },
    {
      id: 4,
      name: "إدارة المدرسة",
      lastMessage: "إشعار دفع الرسوم الدراسية",
      time: "٢٠ نوفمبر",
      unread: 0,
      icon: "office-building",
    },
    {
      id: 5,
      name: "النشاط الرياضي",
      lastMessage: "بطولة كرة القدم القادمة",
      time: "١٥ نوفمبر",
      unread: 0,
      icon: "soccer",
    },
  ];

  const announcements = [
    {
      id: 1,
      title: "إجازة نصف العام",
      date: "١ ديسمبر ٢٠٢٣",
      content: "تبدأ إجازة نصف العام من ٢٠ ديسمبر إلى ٥ يناير",
    },
    {
      id: 2,
      title: "يوم مفتوح",
      date: "٢٨ نوفمبر ٢٠٢٣",
      content: "يوم مفتوح لأولياء الأمور للقاء المعلمين",
    },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>التواصل مع المدرسة</Text>
        <Icon name="message-text" size={28} color="#2C3E50" />
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Icon
          name="magnify"
          size={20}
          color="#7F8C8D"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="ابحث في المحادثات أو الإعلانات..."
          placeholderTextColor="#95A5A6"
        />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Announcements Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>الإعلانات المهمة</Text>
            <Icon name="bullhorn" size={20} color="#3498DB" />
          </View>

          {announcements.map((announcement) => (
            <TouchableOpacity
              key={announcement.id}
              style={styles.announcementCard}
            >
              <View style={styles.announcementHeader}>
                <View>
                  <Text style={styles.announcementTitle}>
                    {announcement.title}
                  </Text>
                  <Text style={styles.announcementDate}>
                    {announcement.date}
                  </Text>
                </View>
                <Icon name="clipboard-text" size={24} color="#2C3E50" />
              </View>
              <Text style={styles.announcementContent}>
                {announcement.content}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Conversations Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>المحادثات النشطة</Text>
            <Icon name="forum" size={20} color="#27AE60" />
          </View>

          {conversations.map((chat) => (
            <TouchableOpacity key={chat.id} style={styles.chatItem}>
              <View style={styles.chatIconContainer}>
                <Icon name={chat.icon} size={24} color="#FFFFFF" />
              </View>

              <View style={styles.chatInfo}>
                <View style={styles.chatHeader}>
                  <Text style={styles.chatName}>{chat.name}</Text>
                  <Text style={styles.chatTime}>{chat.time}</Text>
                </View>

                <View style={styles.chatFooter}>
                  <Text style={styles.chatMessage} numberOfLines={1}>
                    {chat.lastMessage}
                  </Text>
                  {chat.unread > 0 && (
                    <View style={styles.unreadBadge}>
                      <Text style={styles.unreadText}>{chat.unread}</Text>
                    </View>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>إجراءات سريعة</Text>
            <Icon name="lightning-bolt" size={20} color="#E74C3C" />
          </View>

          <View style={styles.actionsContainer}>
            <TouchableOpacity style={styles.actionButton}>
              <View style={[styles.actionIcon, { backgroundColor: "#3498DB" }]}>
                <Icon name="email" size={24} color="#FFFFFF" />
              </View>
              <Text style={styles.actionText}>رسالة جديدة</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton}>
              <View style={[styles.actionIcon, { backgroundColor: "#27AE60" }]}>
                <Icon name="calendar" size={24} color="#FFFFFF" />
              </View>
              <Text style={styles.actionText}>جدول الاجتماعات</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton}>
              <View style={[styles.actionIcon, { backgroundColor: "#9B59B6" }]}>
                <Icon name="file-document" size={24} color="#FFFFFF" />
              </View>
              <Text style={styles.actionText}>الواجبات</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab}>
        <Icon name="pencil" size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
    marginBottom:14,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#ECF0F1",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#2C3E50",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    marginVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ECF0F1",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
    color: "#2C3E50",
    textAlign: "right",
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2C3E50",
  },
  announcementCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#3498DB",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  announcementHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  announcementTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2C3E50",
    marginBottom: 4,
  },
  announcementDate: {
    fontSize: 14,
    color: "#7F8C8D",
  },
  announcementContent: {
    fontSize: 14,
    color: "#34495E",
    lineHeight: 20,
  },
  chatItem: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    alignItems: "center",
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  chatIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#3498DB",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 12,
  },
  chatInfo: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  chatName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2C3E50",
  },
  chatTime: {
    fontSize: 12,
    color: "#7F8C8D",
  },
  chatFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  chatMessage: {
    fontSize: 14,
    color: "#7F8C8D",
    flex: 1,
  },
  unreadBadge: {
    backgroundColor: "#E74C3C",
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  unreadText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
    paddingHorizontal: 6,
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 8,
  },
  actionButton: {
    alignItems: "center",
    width: "30%",
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  actionText: {
    fontSize: 12,
    color: "#2C3E50",
    textAlign: "center",
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 30,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#3498DB",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
});

export default CommunicationsScreen;
