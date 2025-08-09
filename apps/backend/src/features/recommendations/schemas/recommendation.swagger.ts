/**
 * @swagger
 * components:
 *   schemas:
 *     LearningPattern:
 *       type: object
 *       required:
 *         - averageScore
 *         - learningSpeed
 *         - strugglingAreas
 *         - strongAreas
 *         - preferredDifficulty
 *         - consistencyScore
 *       properties:
 *         averageScore:
 *           type: number
 *           description: User's average score percentage
 *           example: 75.5
 *         learningSpeed:
 *           type: number
 *           description: Problems completed per minute
 *           example: 1.2
 *         strugglingAreas:
 *           type: array
 *           items:
 *             type: string
 *           description: Difficulty levels where user struggles
 *           example: ["hard"]
 *         strongAreas:
 *           type: array
 *           items:
 *             type: string
 *           description: Difficulty levels where user excels
 *           example: ["easy", "medium"]
 *         preferredDifficulty:
 *           type: string
 *           enum: [easy, medium, hard]
 *           description: User's optimal difficulty level
 *           example: "medium"
 *         consistencyScore:
 *           type: number
 *           description: How consistent the learner is (0-100)
 *           example: 68
 * 
 *     LessonRecommendation:
 *       type: object
 *       required:
 *         - lessonId
 *         - title
 *         - description
 *         - recommendationReason
 *         - confidenceScore
 *         - estimatedCompletionTime
 *         - difficulty
 *         - xpReward
 *         - order
 *         - isUnlocked
 *         - prerequisites
 *       properties:
 *         lessonId:
 *           type: string
 *           description: Unique lesson identifier
 *           example: "lesson-2"
 *         title:
 *           type: string
 *           description: Lesson title
 *           example: "Intermediate Algebra"
 *         description:
 *           type: string
 *           description: Lesson description
 *           example: "Build on basic concepts"
 *         recommendationReason:
 *           type: string
 *           description: Why this lesson is recommended
 *           example: "Next in your learning sequence"
 *         confidenceScore:
 *           type: number
 *           description: Confidence in recommendation (0-100)
 *           example: 85
 *         estimatedCompletionTime:
 *           type: number
 *           description: Estimated completion time in minutes
 *           example: 20
 *         difficulty:
 *           type: string
 *           description: Lesson difficulty level
 *           example: "medium"
 *         xpReward:
 *           type: number
 *           description: XP reward for completing lesson
 *           example: 15
 *         order:
 *           type: number
 *           description: Lesson order in curriculum
 *           example: 2
 *         isUnlocked:
 *           type: boolean
 *           description: Whether lesson is accessible
 *           example: true
 *         prerequisites:
 *           type: array
 *           items:
 *             type: string
 *           description: Required lessons before this one
 *           example: ["Basic Arithmetic"]
 * 
 *     AdaptiveLearningPath:
 *       type: object
 *       required:
 *         - userId
 *         - generatedAt
 *         - learningPattern
 *         - recommendations
 *         - personalizedMessage
 *         - learningGoals
 *       properties:
 *         userId:
 *           type: string
 *           description: User ID for recommendations
 *           example: "1"
 *         generatedAt:
 *           type: string
 *           format: date-time
 *           description: When recommendations were generated
 *           example: "2025-08-09T10:30:00.000Z"
 *         learningPattern:
 *           $ref: '#/components/schemas/LearningPattern'
 *         recommendations:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/LessonRecommendation'
 *           description: List of recommended lessons
 *         nextSuggestedLesson:
 *           allOf:
 *             - $ref: '#/components/schemas/LessonRecommendation'
 *             - nullable: true
 *           description: Top recommended lesson
 *         personalizedMessage:
 *           type: string
 *           description: Personalized message for the user
 *           example: "Great progress! You're building strong foundations."
 *         learningGoals:
 *           type: array
 *           items:
 *             type: string
 *           description: Suggested learning goals
 *           example: ["Achieve 85% accuracy consistently", "Focus on strengthening skills in: hard"]
 */
