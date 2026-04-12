import { relations } from "drizzle-orm/relations";
import { pets, aiAnalyses, users, careLogs, products, cartItems, posts, comments, contentApprovals, institutes, courses, courseProgress, coursePurchases, curriculums, educationCredits, engagementEvents, fcmTokens, friendInvitations, trainerRankings, incentivePayments, instituteApplications, liveStreams, monthlyPointSummary, orders, orderItems, monthlyRevenue, payouts, pointRules, pointTransactions, productCommissions, pushCampaigns, pushNotificationLogs, referralProfiles, referralEarnings, settlements, reservations, scheduledPushNotifications, settlementItems, transactions, feePolicies, shoppingCarts, streamChatMessages, streamViewers, talezScoreCache, trainerActivityLogs, trainerApplications, trainerClientAssignments, trainerInstituteApplications, trainers, trainingJournals, consultationRecords } from "./schema";

export const aiAnalysesRelations = relations(aiAnalyses, ({one}) => ({
	pet: one(pets, {
		fields: [aiAnalyses.petId],
		references: [pets.id]
	}),
	user: one(users, {
		fields: [aiAnalyses.userId],
		references: [users.id]
	}),
}));

export const petsRelations = relations(pets, ({many}) => ({
	aiAnalyses: many(aiAnalyses),
	careLogs: many(careLogs),
	reservations: many(reservations),
	trainingJournals: many(trainingJournals),
	consultationRecords: many(consultationRecords),
}));

export const usersRelations = relations(users, ({many}) => ({
	aiAnalyses: many(aiAnalyses),
	careLogs: many(careLogs),
	cartItems: many(cartItems),
	comments: many(comments),
	contentApprovals_adminReviewerId: many(contentApprovals, {
		relationName: "contentApprovals_adminReviewerId_users_id"
	}),
	contentApprovals_instituteReviewerId: many(contentApprovals, {
		relationName: "contentApprovals_instituteReviewerId_users_id"
	}),
	contentApprovals_submitterId: many(contentApprovals, {
		relationName: "contentApprovals_submitterId_users_id"
	}),
	courseProgresses: many(courseProgress),
	coursePurchases: many(coursePurchases),
	curriculums: many(curriculums),
	educationCredits: many(educationCredits),
	engagementEvents: many(engagementEvents),
	fcmTokens: many(fcmTokens),
	friendInvitations_inviteeId: many(friendInvitations, {
		relationName: "friendInvitations_inviteeId_users_id"
	}),
	friendInvitations_inviterId: many(friendInvitations, {
		relationName: "friendInvitations_inviterId_users_id"
	}),
	trainerRankings: many(trainerRankings),
	incentivePayments: many(incentivePayments),
	instituteApplications: many(instituteApplications),
	liveStreams: many(liveStreams),
	monthlyPointSummaries: many(monthlyPointSummary),
	orders: many(orders),
	payouts: many(payouts),
	pointTransactions: many(pointTransactions),
	pushCampaigns: many(pushCampaigns),
	pushNotificationLogs: many(pushNotificationLogs),
	referralProfiles: many(referralProfiles),
	reservations_trainerId: many(reservations, {
		relationName: "reservations_trainerId_users_id"
	}),
	reservations_userId: many(reservations, {
		relationName: "reservations_userId_users_id"
	}),
	scheduledPushNotifications: many(scheduledPushNotifications),
	shoppingCarts: many(shoppingCarts),
	streamChatMessages: many(streamChatMessages),
	streamViewers: many(streamViewers),
	talezScoreCaches: many(talezScoreCache),
	trainerActivityLogs: many(trainerActivityLogs),
	trainerApplications: many(trainerApplications),
	trainerClientAssignments_assignedBy: many(trainerClientAssignments, {
		relationName: "trainerClientAssignments_assignedBy_users_id"
	}),
	trainerClientAssignments_clientId: many(trainerClientAssignments, {
		relationName: "trainerClientAssignments_clientId_users_id"
	}),
	trainerClientAssignments_trainerId: many(trainerClientAssignments, {
		relationName: "trainerClientAssignments_trainerId_users_id"
	}),
	trainerInstituteApplications_reviewedBy: many(trainerInstituteApplications, {
		relationName: "trainerInstituteApplications_reviewedBy_users_id"
	}),
	trainerInstituteApplications_trainerId: many(trainerInstituteApplications, {
		relationName: "trainerInstituteApplications_trainerId_users_id"
	}),
	trainers: many(trainers),
	trainingJournals_petOwnerId: many(trainingJournals, {
		relationName: "trainingJournals_petOwnerId_users_id"
	}),
	trainingJournals_trainerId: many(trainingJournals, {
		relationName: "trainingJournals_trainerId_users_id"
	}),
	consultationRecords_ownerId: many(consultationRecords, {
		relationName: "consultationRecords_ownerId_users_id"
	}),
	consultationRecords_trainerId: many(consultationRecords, {
		relationName: "consultationRecords_trainerId_users_id"
	}),
}));

export const careLogsRelations = relations(careLogs, ({one}) => ({
	pet: one(pets, {
		fields: [careLogs.petId],
		references: [pets.id]
	}),
	user: one(users, {
		fields: [careLogs.trainerId],
		references: [users.id]
	}),
}));

export const cartItemsRelations = relations(cartItems, ({one}) => ({
	product: one(products, {
		fields: [cartItems.productId],
		references: [products.id]
	}),
	user: one(users, {
		fields: [cartItems.userId],
		references: [users.id]
	}),
}));

export const productsRelations = relations(products, ({many}) => ({
	cartItems: many(cartItems),
	orderItems: many(orderItems),
	productCommissions: many(productCommissions),
	shoppingCarts: many(shoppingCarts),
}));

export const commentsRelations = relations(comments, ({one}) => ({
	post: one(posts, {
		fields: [comments.postId],
		references: [posts.id]
	}),
	user: one(users, {
		fields: [comments.userId],
		references: [users.id]
	}),
}));

export const postsRelations = relations(posts, ({many}) => ({
	comments: many(comments),
}));

export const contentApprovalsRelations = relations(contentApprovals, ({one}) => ({
	user_adminReviewerId: one(users, {
		fields: [contentApprovals.adminReviewerId],
		references: [users.id],
		relationName: "contentApprovals_adminReviewerId_users_id"
	}),
	institute: one(institutes, {
		fields: [contentApprovals.instituteId],
		references: [institutes.id]
	}),
	user_instituteReviewerId: one(users, {
		fields: [contentApprovals.instituteReviewerId],
		references: [users.id],
		relationName: "contentApprovals_instituteReviewerId_users_id"
	}),
	user_submitterId: one(users, {
		fields: [contentApprovals.submitterId],
		references: [users.id],
		relationName: "contentApprovals_submitterId_users_id"
	}),
}));

export const institutesRelations = relations(institutes, ({many}) => ({
	contentApprovals: many(contentApprovals),
	curriculums: many(curriculums),
	reservations: many(reservations),
	trainerInstituteApplications: many(trainerInstituteApplications),
	trainers: many(trainers),
	consultationRecords: many(consultationRecords),
}));

export const courseProgressRelations = relations(courseProgress, ({one}) => ({
	course: one(courses, {
		fields: [courseProgress.courseId],
		references: [courses.id]
	}),
	user: one(users, {
		fields: [courseProgress.userId],
		references: [users.id]
	}),
}));

export const coursesRelations = relations(courses, ({many}) => ({
	courseProgresses: many(courseProgress),
	coursePurchases: many(coursePurchases),
	educationCredits: many(educationCredits),
}));

export const coursePurchasesRelations = relations(coursePurchases, ({one}) => ({
	course: one(courses, {
		fields: [coursePurchases.courseId],
		references: [courses.id]
	}),
	user: one(users, {
		fields: [coursePurchases.userId],
		references: [users.id]
	}),
}));

export const curriculumsRelations = relations(curriculums, ({one}) => ({
	user: one(users, {
		fields: [curriculums.creatorId],
		references: [users.id]
	}),
	institute: one(institutes, {
		fields: [curriculums.instituteId],
		references: [institutes.id]
	}),
}));

export const educationCreditsRelations = relations(educationCredits, ({one}) => ({
	course: one(courses, {
		fields: [educationCredits.usedForCourseId],
		references: [courses.id]
	}),
	user: one(users, {
		fields: [educationCredits.userId],
		references: [users.id]
	}),
}));

export const engagementEventsRelations = relations(engagementEvents, ({one}) => ({
	user: one(users, {
		fields: [engagementEvents.userId],
		references: [users.id]
	}),
}));

export const fcmTokensRelations = relations(fcmTokens, ({one, many}) => ({
	user: one(users, {
		fields: [fcmTokens.userId],
		references: [users.id]
	}),
	pushNotificationLogs: many(pushNotificationLogs),
}));

export const friendInvitationsRelations = relations(friendInvitations, ({one}) => ({
	user_inviteeId: one(users, {
		fields: [friendInvitations.inviteeId],
		references: [users.id],
		relationName: "friendInvitations_inviteeId_users_id"
	}),
	user_inviterId: one(users, {
		fields: [friendInvitations.inviterId],
		references: [users.id],
		relationName: "friendInvitations_inviterId_users_id"
	}),
}));

export const trainerRankingsRelations = relations(trainerRankings, ({one, many}) => ({
	user: one(users, {
		fields: [trainerRankings.trainerId],
		references: [users.id]
	}),
	incentivePayments: many(incentivePayments),
}));

export const incentivePaymentsRelations = relations(incentivePayments, ({one}) => ({
	trainerRanking: one(trainerRankings, {
		fields: [incentivePayments.rankingId],
		references: [trainerRankings.id]
	}),
	user: one(users, {
		fields: [incentivePayments.trainerId],
		references: [users.id]
	}),
}));

export const instituteApplicationsRelations = relations(instituteApplications, ({one}) => ({
	user: one(users, {
		fields: [instituteApplications.reviewedBy],
		references: [users.id]
	}),
}));

export const liveStreamsRelations = relations(liveStreams, ({one, many}) => ({
	user: one(users, {
		fields: [liveStreams.hostId],
		references: [users.id]
	}),
	streamChatMessages: many(streamChatMessages),
	streamViewers: many(streamViewers),
}));

export const monthlyPointSummaryRelations = relations(monthlyPointSummary, ({one}) => ({
	user: one(users, {
		fields: [monthlyPointSummary.userId],
		references: [users.id]
	}),
}));

export const ordersRelations = relations(orders, ({one, many}) => ({
	user: one(users, {
		fields: [orders.userId],
		references: [users.id]
	}),
	orderItems: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({one}) => ({
	order: one(orders, {
		fields: [orderItems.orderId],
		references: [orders.id]
	}),
	product: one(products, {
		fields: [orderItems.productId],
		references: [products.id]
	}),
}));

export const payoutsRelations = relations(payouts, ({one}) => ({
	monthlyRevenue: one(monthlyRevenue, {
		fields: [payouts.revenueId],
		references: [monthlyRevenue.id]
	}),
	user: one(users, {
		fields: [payouts.userId],
		references: [users.id]
	}),
}));

export const monthlyRevenueRelations = relations(monthlyRevenue, ({many}) => ({
	payouts: many(payouts),
}));

export const pointTransactionsRelations = relations(pointTransactions, ({one}) => ({
	pointRule: one(pointRules, {
		fields: [pointTransactions.ruleId],
		references: [pointRules.id]
	}),
	user: one(users, {
		fields: [pointTransactions.userId],
		references: [users.id]
	}),
}));

export const pointRulesRelations = relations(pointRules, ({many}) => ({
	pointTransactions: many(pointTransactions),
}));

export const productCommissionsRelations = relations(productCommissions, ({one}) => ({
	product: one(products, {
		fields: [productCommissions.productId],
		references: [products.id]
	}),
}));

export const pushCampaignsRelations = relations(pushCampaigns, ({one, many}) => ({
	user: one(users, {
		fields: [pushCampaigns.createdBy],
		references: [users.id]
	}),
	pushNotificationLogs: many(pushNotificationLogs),
	scheduledPushNotifications: many(scheduledPushNotifications),
}));

export const pushNotificationLogsRelations = relations(pushNotificationLogs, ({one}) => ({
	pushCampaign: one(pushCampaigns, {
		fields: [pushNotificationLogs.campaignId],
		references: [pushCampaigns.id]
	}),
	fcmToken: one(fcmTokens, {
		fields: [pushNotificationLogs.tokenId],
		references: [fcmTokens.id]
	}),
	user: one(users, {
		fields: [pushNotificationLogs.userId],
		references: [users.id]
	}),
}));

export const referralProfilesRelations = relations(referralProfiles, ({one, many}) => ({
	user: one(users, {
		fields: [referralProfiles.userId],
		references: [users.id]
	}),
	referralEarnings: many(referralEarnings),
	settlements: many(settlements),
}));

export const referralEarningsRelations = relations(referralEarnings, ({one}) => ({
	referralProfile: one(referralProfiles, {
		fields: [referralEarnings.referralProfileId],
		references: [referralProfiles.id]
	}),
	settlement: one(settlements, {
		fields: [referralEarnings.settlementId],
		references: [settlements.id]
	}),
}));

export const settlementsRelations = relations(settlements, ({one, many}) => ({
	referralEarnings: many(referralEarnings),
	referralProfile: one(referralProfiles, {
		fields: [settlements.referralProfileId],
		references: [referralProfiles.id]
	}),
	settlementItems: many(settlementItems),
}));

export const reservationsRelations = relations(reservations, ({one}) => ({
	institute: one(institutes, {
		fields: [reservations.instituteId],
		references: [institutes.id]
	}),
	pet: one(pets, {
		fields: [reservations.petId],
		references: [pets.id]
	}),
	user_trainerId: one(users, {
		fields: [reservations.trainerId],
		references: [users.id],
		relationName: "reservations_trainerId_users_id"
	}),
	user_userId: one(users, {
		fields: [reservations.userId],
		references: [users.id],
		relationName: "reservations_userId_users_id"
	}),
}));

export const scheduledPushNotificationsRelations = relations(scheduledPushNotifications, ({one}) => ({
	pushCampaign: one(pushCampaigns, {
		fields: [scheduledPushNotifications.campaignId],
		references: [pushCampaigns.id]
	}),
	user: one(users, {
		fields: [scheduledPushNotifications.userId],
		references: [users.id]
	}),
}));

export const settlementItemsRelations = relations(settlementItems, ({one}) => ({
	settlement: one(settlements, {
		fields: [settlementItems.settlementId],
		references: [settlements.id]
	}),
	transaction: one(transactions, {
		fields: [settlementItems.transactionId],
		references: [transactions.id]
	}),
}));

export const transactionsRelations = relations(transactions, ({one, many}) => ({
	settlementItems: many(settlementItems),
	feePolicy: one(feePolicies, {
		fields: [transactions.feePolicyId],
		references: [feePolicies.id]
	}),
}));

export const feePoliciesRelations = relations(feePolicies, ({many}) => ({
	transactions: many(transactions),
}));

export const shoppingCartsRelations = relations(shoppingCarts, ({one}) => ({
	product: one(products, {
		fields: [shoppingCarts.productId],
		references: [products.id]
	}),
	user: one(users, {
		fields: [shoppingCarts.userId],
		references: [users.id]
	}),
}));

export const streamChatMessagesRelations = relations(streamChatMessages, ({one}) => ({
	liveStream: one(liveStreams, {
		fields: [streamChatMessages.streamId],
		references: [liveStreams.id]
	}),
	user: one(users, {
		fields: [streamChatMessages.userId],
		references: [users.id]
	}),
}));

export const streamViewersRelations = relations(streamViewers, ({one}) => ({
	liveStream: one(liveStreams, {
		fields: [streamViewers.streamId],
		references: [liveStreams.id]
	}),
	user: one(users, {
		fields: [streamViewers.userId],
		references: [users.id]
	}),
}));

export const talezScoreCacheRelations = relations(talezScoreCache, ({one}) => ({
	user: one(users, {
		fields: [talezScoreCache.userId],
		references: [users.id]
	}),
}));

export const trainerActivityLogsRelations = relations(trainerActivityLogs, ({one}) => ({
	user: one(users, {
		fields: [trainerActivityLogs.trainerId],
		references: [users.id]
	}),
}));

export const trainerApplicationsRelations = relations(trainerApplications, ({one}) => ({
	user: one(users, {
		fields: [trainerApplications.reviewedBy],
		references: [users.id]
	}),
}));

export const trainerClientAssignmentsRelations = relations(trainerClientAssignments, ({one}) => ({
	user_assignedBy: one(users, {
		fields: [trainerClientAssignments.assignedBy],
		references: [users.id],
		relationName: "trainerClientAssignments_assignedBy_users_id"
	}),
	user_clientId: one(users, {
		fields: [trainerClientAssignments.clientId],
		references: [users.id],
		relationName: "trainerClientAssignments_clientId_users_id"
	}),
	user_trainerId: one(users, {
		fields: [trainerClientAssignments.trainerId],
		references: [users.id],
		relationName: "trainerClientAssignments_trainerId_users_id"
	}),
}));

export const trainerInstituteApplicationsRelations = relations(trainerInstituteApplications, ({one}) => ({
	institute: one(institutes, {
		fields: [trainerInstituteApplications.instituteId],
		references: [institutes.id]
	}),
	user_reviewedBy: one(users, {
		fields: [trainerInstituteApplications.reviewedBy],
		references: [users.id],
		relationName: "trainerInstituteApplications_reviewedBy_users_id"
	}),
	user_trainerId: one(users, {
		fields: [trainerInstituteApplications.trainerId],
		references: [users.id],
		relationName: "trainerInstituteApplications_trainerId_users_id"
	}),
}));

export const trainersRelations = relations(trainers, ({one}) => ({
	institute: one(institutes, {
		fields: [trainers.instituteId],
		references: [institutes.id]
	}),
	user: one(users, {
		fields: [trainers.userId],
		references: [users.id]
	}),
}));

export const trainingJournalsRelations = relations(trainingJournals, ({one}) => ({
	pet: one(pets, {
		fields: [trainingJournals.petId],
		references: [pets.id]
	}),
	user_petOwnerId: one(users, {
		fields: [trainingJournals.petOwnerId],
		references: [users.id],
		relationName: "trainingJournals_petOwnerId_users_id"
	}),
	user_trainerId: one(users, {
		fields: [trainingJournals.trainerId],
		references: [users.id],
		relationName: "trainingJournals_trainerId_users_id"
	}),
}));

export const consultationRecordsRelations = relations(consultationRecords, ({one}) => ({
	institute: one(institutes, {
		fields: [consultationRecords.instituteId],
		references: [institutes.id]
	}),
	user_ownerId: one(users, {
		fields: [consultationRecords.ownerId],
		references: [users.id],
		relationName: "consultationRecords_ownerId_users_id"
	}),
	pet: one(pets, {
		fields: [consultationRecords.petId],
		references: [pets.id]
	}),
	user_trainerId: one(users, {
		fields: [consultationRecords.trainerId],
		references: [users.id],
		relationName: "consultationRecords_trainerId_users_id"
	}),
}));