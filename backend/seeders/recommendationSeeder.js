require('dotenv').config();
const mongoose = require('mongoose');
const Recommendation = require('../models/Recommendation');

const recommendations = [
    // ============================================
    // YOGA ASANAS - For All Risk Levels
    // ============================================
    {
        title: 'Child\'s Pose (Balasana)',
        description: 'A gentle resting pose that calms the mind and relieves stress and anxiety',
        type: 'yoga',
        category: 'physical',
        difficulty: 'Beginner',
        duration: '3-5 minutes',
        riskLevels: ['Low', 'Medium', 'High'],
        icon: 'Heart',
        color: 'bg-purple-100 text-purple-600',
        steps: [
            'Kneel on the floor with toes together and knees hip-width apart',
            'Exhale and lower your torso between your thighs',
            'Extend your arms forward or rest them alongside your body',
            'Rest your forehead on the mat',
            'Breathe deeply and hold for 3-5 minutes'
        ],
        benefits: [
            'Calms the brain and relieves stress',
            'Gently stretches the hips, thighs, and ankles',
            'Reduces anxiety and fatigue',
            'Helps alleviate back pain'
        ]
    },
    {
        title: 'Cat-Cow Pose (Marjaryasana-Bitilasana)',
        description: 'A gentle flow between two poses that releases tension in the spine and calms the mind',
        type: 'yoga',
        category: 'physical',
        difficulty: 'Beginner',
        duration: '5-7 minutes',
        riskLevels: ['Low', 'Medium', 'High'],
        icon: 'Heart',
        color: 'bg-purple-100 text-purple-600',
        steps: [
            'Start on hands and knees in tabletop position',
            'Inhale, drop belly, lift chest and tailbone (Cow)',
            'Exhale, round spine, tuck chin to chest (Cat)',
            'Continue flowing between poses with breath',
            'Repeat 10-15 times'
        ],
        benefits: [
            'Releases tension in spine and neck',
            'Improves posture and balance',
            'Calms the mind through rhythmic movement',
            'Massages internal organs'
        ]
    },
    {
        title: 'Legs-Up-The-Wall (Viparita Karani)',
        description: 'A restorative inversion that promotes deep relaxation and reduces anxiety',
        type: 'yoga',
        category: 'physical',
        difficulty: 'Beginner',
        duration: '5-15 minutes',
        riskLevels: ['Low', 'Medium', 'High'],
        icon: 'Heart',
        color: 'bg-purple-100 text-purple-600',
        steps: [
            'Sit sideways against a wall',
            'Swing legs up the wall as you lower your back to the floor',
            'Adjust so your sitting bones are close to the wall',
            'Rest arms by your sides, palms up',
            'Close eyes and breathe deeply for 5-15 minutes'
        ],
        benefits: [
            'Reduces anxiety and stress',
            'Improves circulation',
            'Relieves tired legs and feet',
            'Promotes deep relaxation'
        ]
    },
    {
        title: 'Corpse Pose (Savasana)',
        description: 'The ultimate relaxation pose that integrates the benefits of your practice',
        type: 'yoga',
        category: 'physical',
        difficulty: 'Beginner',
        duration: '10-20 minutes',
        riskLevels: ['Low', 'Medium', 'High'],
        icon: 'Heart',
        color: 'bg-purple-100 text-purple-600',
        steps: [
            'Lie flat on your back with legs extended',
            'Let feet fall open naturally',
            'Rest arms alongside body, palms facing up',
            'Close your eyes and breathe naturally',
            'Systematically relax each part of your body'
        ],
        benefits: [
            'Reduces stress and anxiety',
            'Lowers blood pressure',
            'Promotes deep rest and recovery',
            'Calms the nervous system'
        ]
    },
    {
        title: 'Standing Forward Bend (Uttanasana)',
        description: 'A calming forward fold that relieves anxiety and quiets the mind',
        type: 'yoga',
        category: 'physical',
        difficulty: 'Beginner',
        duration: '3-5 minutes',
        riskLevels: ['Low', 'Medium', 'High'],
        icon: 'Heart',
        color: 'bg-purple-100 text-purple-600',
        steps: [
            'Stand with feet hip-width apart',
            'Exhale and fold forward from the hips',
            'Let arms hang or hold opposite elbows',
            'Relax head and neck completely',
            'Breathe deeply for 1-3 minutes'
        ],
        benefits: [
            'Calms the brain and relieves stress',
            'Reduces anxiety and mild depression',
            'Stretches hamstrings and calves',
            'Stimulates liver and kidneys'
        ]
    },

    // ============================================
    // MEDITATION PRACTICES - For All Risk Levels
    // ============================================
    {
        title: 'Mindfulness Meditation',
        description: 'Present-moment awareness practice to reduce anxiety and increase mental clarity',
        type: 'meditation',
        category: 'mindfulness',
        difficulty: 'Beginner',
        duration: '10-20 minutes',
        riskLevels: ['Low', 'Medium', 'High'],
        icon: 'Target',
        color: 'bg-orange-100 text-orange-600',
        steps: [
            'Sit comfortably with spine straight',
            'Close eyes or maintain soft gaze',
            'Focus attention on your breath',
            'Notice thoughts without judgment',
            'Gently return focus to breath when mind wanders'
        ],
        benefits: [
            'Reduces overall anxiety levels',
            'Improves emotional regulation',
            'Enhances self-awareness',
            'Scientifically proven mental health benefits'
        ]
    },
    {
        title: 'Loving-Kindness Meditation (Metta)',
        description: 'Cultivate compassion for yourself and others to reduce negative emotions',
        type: 'meditation',
        category: 'mindfulness',
        difficulty: 'Beginner',
        duration: '15-20 minutes',
        riskLevels: ['Low', 'Medium', 'High'],
        icon: 'Target',
        color: 'bg-orange-100 text-orange-600',
        steps: [
            'Sit comfortably and close your eyes',
            'Begin by directing kindness to yourself',
            'Repeat phrases: "May I be happy, may I be healthy"',
            'Extend these wishes to loved ones, then all beings',
            'Notice feelings of warmth and connection'
        ],
        benefits: [
            'Increases positive emotions',
            'Reduces self-criticism and anxiety',
            'Improves social connections',
            'Enhances empathy and compassion'
        ]
    },
    {
        title: 'Body Scan Meditation',
        description: 'Systematic relaxation technique that releases physical tension and calms the mind',
        type: 'meditation',
        category: 'mindfulness',
        difficulty: 'Beginner',
        duration: '15-30 minutes',
        riskLevels: ['Low', 'Medium', 'High'],
        icon: 'Target',
        color: 'bg-orange-100 text-orange-600',
        steps: [
            'Lie down in a comfortable position',
            'Close your eyes and breathe naturally',
            'Bring awareness to your toes, notice sensations',
            'Slowly move attention up through each body part',
            'Release tension as you scan each area'
        ],
        benefits: [
            'Reduces physical tension and stress',
            'Improves body awareness',
            'Helps with sleep and relaxation',
            'Decreases anxiety symptoms'
        ]
    },
    {
        title: 'Breath Awareness Meditation',
        description: 'Simple yet powerful practice focusing on the natural rhythm of breathing',
        type: 'meditation',
        category: 'breathing',
        difficulty: 'Beginner',
        duration: '10-15 minutes',
        riskLevels: ['Low', 'Medium', 'High'],
        icon: 'Wind',
        color: 'bg-blue-100 text-blue-600',
        steps: [
            'Sit in a comfortable position',
            'Close your eyes gently',
            'Notice the natural flow of your breath',
            'Count breaths from 1 to 10, then repeat',
            'Return to counting when mind wanders'
        ],
        benefits: [
            'Calms the nervous system',
            'Improves focus and concentration',
            'Reduces anxiety quickly',
            'Can be practiced anywhere'
        ]
    },
    {
        title: 'Guided Visualization',
        description: 'Use mental imagery to create a peaceful inner sanctuary and reduce stress',
        type: 'meditation',
        category: 'mindfulness',
        difficulty: 'Beginner',
        duration: '15-20 minutes',
        riskLevels: ['Low', 'Medium', 'High'],
        icon: 'Target',
        color: 'bg-orange-100 text-orange-600',
        steps: [
            'Find a quiet, comfortable place to sit or lie down',
            'Close your eyes and take deep breaths',
            'Imagine a peaceful, safe place in detail',
            'Engage all senses: sights, sounds, smells, textures',
            'Stay in this visualization for 10-15 minutes'
        ],
        benefits: [
            'Reduces stress and anxiety',
            'Promotes positive mental states',
            'Enhances creativity and problem-solving',
            'Provides mental escape and relaxation'
        ]
    },

    // ============================================
    // LIFESTYLE - Sleep Habits (Risk-Specific)
    // ============================================
    {
        title: 'Basic Sleep Hygiene',
        description: 'Establish a consistent sleep routine for better mental health',
        type: 'lifestyle',
        category: 'sleep',
        difficulty: 'Beginner',
        duration: 'Daily practice',
        riskLevels: ['Low'],
        icon: 'Heart',
        color: 'bg-indigo-100 text-indigo-600',
        steps: [
            'Go to bed and wake up at the same time daily',
            'Avoid screens 30 minutes before bed',
            'Keep bedroom cool, dark, and quiet',
            'Limit caffeine after 2 PM'
        ],
        benefits: [
            'Improves sleep quality',
            'Reduces daytime fatigue',
            'Enhances mood stability',
            'Supports overall mental health'
        ]
    },
    {
        title: 'Enhanced Sleep Protocol',
        description: 'Comprehensive sleep optimization for anxiety management',
        type: 'lifestyle',
        category: 'sleep',
        difficulty: 'Intermediate',
        duration: 'Daily practice',
        riskLevels: ['Medium'],
        icon: 'Heart',
        color: 'bg-indigo-100 text-indigo-600',
        steps: [
            'Maintain strict sleep schedule (7-9 hours)',
            'Create calming bedtime ritual (warm bath, reading)',
            'Avoid screens 1 hour before bed',
            'Practice relaxation techniques before sleep',
            'Keep a worry journal to clear your mind',
            'Limit caffeine and alcohol'
        ],
        benefits: [
            'Significantly improves sleep quality',
            'Reduces nighttime anxiety',
            'Enhances emotional regulation',
            'Supports anxiety recovery'
        ]
    },
    {
        title: 'Therapeutic Sleep Management',
        description: 'Clinical-grade sleep intervention for severe anxiety and sleep disturbances',
        type: 'lifestyle',
        category: 'sleep',
        difficulty: 'Advanced',
        duration: 'Daily practice',
        riskLevels: ['High'],
        icon: 'Heart',
        color: 'bg-indigo-100 text-indigo-600',
        steps: [
            'Follow strict sleep-wake schedule (no exceptions)',
            'Implement stimulus control (bed only for sleep)',
            'Practice sleep restriction therapy',
            'Use progressive muscle relaxation before bed',
            'Keep detailed sleep diary',
            'Consider melatonin supplementation (consult doctor)',
            'Eliminate all stimulants and depressants'
        ],
        benefits: [
            'Treats chronic insomnia',
            'Breaks anxiety-sleep cycle',
            'Restores natural sleep patterns',
            'Critical for mental health recovery'
        ]
    },

    // ============================================
    // LIFESTYLE - Nutrition (Risk-Specific)
    // ============================================
    {
        title: 'Balanced Nutrition Basics',
        description: 'Simple dietary guidelines to support mental wellness',
        type: 'lifestyle',
        category: 'nutrition',
        difficulty: 'Beginner',
        duration: 'Daily practice',
        riskLevels: ['Low'],
        icon: 'Heart',
        color: 'bg-green-100 text-green-600',
        steps: [
            'Eat regular, balanced meals',
            'Include fruits and vegetables daily',
            'Stay hydrated (8 glasses of water)',
            'Limit sugar and processed foods'
        ],
        benefits: [
            'Stabilizes blood sugar and mood',
            'Provides essential nutrients',
            'Increases energy levels',
            'Supports overall health'
        ]
    },
    {
        title: 'Anxiety-Reducing Diet',
        description: 'Targeted nutrition plan to reduce anxiety symptoms',
        type: 'lifestyle',
        category: 'nutrition',
        difficulty: 'Intermediate',
        duration: 'Daily practice',
        riskLevels: ['Medium'],
        icon: 'Heart',
        color: 'bg-green-100 text-green-600',
        steps: [
            'Eat omega-3 rich foods (salmon, walnuts, flaxseeds)',
            'Include magnesium sources (dark leafy greens, nuts)',
            'Consume probiotic foods (yogurt, kefir, kimchi)',
            'Eat complex carbohydrates for serotonin production',
            'Limit caffeine to 1 cup per day',
            'Avoid alcohol and excessive sugar'
        ],
        benefits: [
            'Reduces anxiety symptoms',
            'Supports gut-brain connection',
            'Stabilizes mood and energy',
            'Enhances neurotransmitter production'
        ]
    },
    {
        title: 'Clinical Nutrition Protocol',
        description: 'Comprehensive dietary intervention for severe anxiety',
        type: 'lifestyle',
        category: 'nutrition',
        difficulty: 'Advanced',
        duration: 'Daily practice',
        riskLevels: ['High'],
        icon: 'Heart',
        color: 'bg-green-100 text-green-600',
        steps: [
            'Follow anti-inflammatory Mediterranean diet',
            'Supplement with Omega-3 (consult doctor)',
            'Take B-complex vitamins for stress',
            'Include magnesium and vitamin D',
            'Eliminate caffeine completely',
            'Avoid alcohol, sugar, and processed foods',
            'Work with nutritionist for personalized plan'
        ],
        benefits: [
            'Significantly reduces anxiety',
            'Supports medication effectiveness',
            'Repairs gut-brain axis',
            'Provides therapeutic nutritional support'
        ]
    },

    // ============================================
    // LIFESTYLE - Exercise (Risk-Specific)
    // ============================================
    {
        title: 'Daily Movement Practice',
        description: 'Light physical activity to boost mood and reduce stress',
        type: 'lifestyle',
        category: 'physical',
        difficulty: 'Beginner',
        duration: '20-30 minutes daily',
        riskLevels: ['Low'],
        icon: 'Heart',
        color: 'bg-pink-100 text-pink-600',
        steps: [
            'Take a 20-30 minute walk daily',
            'Practice gentle stretching',
            'Try dancing or light activities you enjoy',
            'Aim for 150 minutes of activity per week'
        ],
        benefits: [
            'Releases endorphins',
            'Improves mood naturally',
            'Reduces stress hormones',
            'Enhances overall well-being'
        ]
    },
    {
        title: 'Structured Exercise Routine',
        description: 'Regular exercise program to manage anxiety symptoms',
        type: 'lifestyle',
        category: 'physical',
        difficulty: 'Intermediate',
        duration: '30-45 minutes, 4-5x/week',
        riskLevels: ['Medium'],
        icon: 'Heart',
        color: 'bg-pink-100 text-pink-600',
        steps: [
            'Combine cardio (running, cycling) 3x/week',
            'Add strength training 2x/week',
            'Include yoga or tai chi for mind-body connection',
            'Maintain consistent schedule',
            'Track progress and celebrate milestones'
        ],
        benefits: [
            'Significantly reduces anxiety',
            'Improves sleep quality',
            'Builds confidence and resilience',
            'Provides healthy coping mechanism'
        ]
    },
    {
        title: 'Therapeutic Exercise Program',
        description: 'Intensive physical activity protocol for severe anxiety',
        type: 'lifestyle',
        category: 'physical',
        difficulty: 'Advanced',
        duration: '45-60 minutes, 5-6x/week',
        riskLevels: ['High'],
        icon: 'Heart',
        color: 'bg-pink-100 text-pink-600',
        steps: [
            'Daily aerobic exercise (30+ minutes)',
            'Strength training 3x/week',
            'Yoga or tai chi 2-3x/week',
            'Outdoor activities for nature therapy',
            'Work with fitness professional',
            'Combine with other treatments',
            'Monitor heart rate and intensity'
        ],
        benefits: [
            'Powerful anxiety reduction',
            'Complements therapy and medication',
            'Rebuilds physical and mental strength',
            'Provides structure and routine'
        ]
    },

    // ============================================
    // REMEDIES - Low Risk (Minimal/None)
    // ============================================
    // Note: Low risk users don't need remedies, just yoga/meditation/lifestyle

    // ============================================
    // REMEDIES - Medium Risk (Therapeutic)
    // ============================================
    {
        title: 'Journaling Practice',
        description: 'Structured writing to process emotions and identify patterns',
        type: 'remedy',
        category: 'cognitive',
        difficulty: 'Beginner',
        duration: '15-20 minutes daily',
        riskLevels: ['Medium'],
        icon: 'BookOpen',
        color: 'bg-yellow-100 text-yellow-600',
        steps: [
            'Set aside 15 minutes daily for writing',
            'Write about your thoughts and feelings freely',
            'Identify anxiety triggers and patterns',
            'Note positive experiences and gratitude',
            'Review weekly to track progress'
        ],
        benefits: [
            'Processes difficult emotions',
            'Identifies anxiety patterns',
            'Provides emotional release',
            'Tracks progress over time'
        ]
    },
    {
        title: 'Social Support Network',
        description: 'Build and maintain connections with supportive people',
        type: 'remedy',
        category: 'social',
        difficulty: 'Intermediate',
        duration: 'Ongoing',
        riskLevels: ['Medium'],
        icon: 'Users',
        color: 'bg-blue-100 text-blue-600',
        steps: [
            'Identify trusted friends or family members',
            'Schedule regular check-ins or meetups',
            'Join support groups (online or in-person)',
            'Share your feelings with trusted people',
            'Offer support to others when able'
        ],
        benefits: [
            'Reduces feelings of isolation',
            'Provides emotional support',
            'Normalizes anxiety experiences',
            'Builds resilience through connection'
        ]
    },
    {
        title: 'Cognitive Behavioral Techniques',
        description: 'Self-help CBT strategies to challenge anxious thoughts',
        type: 'remedy',
        category: 'cognitive',
        difficulty: 'Intermediate',
        duration: '15-30 minutes daily',
        riskLevels: ['Medium'],
        icon: 'BookOpen',
        color: 'bg-purple-100 text-purple-600',
        steps: [
            'Identify negative automatic thoughts',
            'Challenge thoughts with evidence',
            'Generate alternative, balanced thoughts',
            'Practice behavioral experiments',
            'Use thought records to track patterns'
        ],
        benefits: [
            'Reduces negative thinking',
            'Improves rational perspective',
            'Builds long-term coping skills',
            'Evidence-based anxiety treatment'
        ]
    },
    {
        title: 'Gradual Exposure Practice',
        description: 'Systematically face feared situations to reduce avoidance',
        type: 'remedy',
        category: 'behavioral',
        difficulty: 'Intermediate',
        duration: 'Weekly practice',
        riskLevels: ['Medium'],
        icon: 'Target',
        color: 'bg-green-100 text-green-600',
        steps: [
            'Create hierarchy of feared situations (0-10 scale)',
            'Start with lowest anxiety situation',
            'Stay in situation until anxiety decreases',
            'Repeat until comfortable, then progress',
            'Track progress and celebrate wins'
        ],
        benefits: [
            'Reduces avoidance behavior',
            'Builds confidence gradually',
            'Evidence-based for anxiety',
            'Creates lasting change'
        ]
    },

    // ============================================
    // REMEDIES - High Risk (Professional Help)
    // ============================================
    {
        title: 'Professional Counseling/Therapy',
        description: 'Work with a licensed mental health professional for comprehensive treatment',
        type: 'remedy',
        category: 'professional',
        difficulty: 'Beginner',
        duration: 'Weekly sessions',
        riskLevels: ['High'],
        icon: 'Users',
        color: 'bg-red-100 text-red-600',
        steps: [
            'Research licensed therapists in your area',
            'Schedule initial consultation',
            'Commit to weekly therapy sessions',
            'Be honest and open with your therapist',
            'Complete homework assignments between sessions',
            'Give therapy time to work (8-12 weeks minimum)'
        ],
        benefits: [
            'Professional diagnosis and treatment',
            'Evidence-based interventions (CBT, DBT)',
            'Personalized treatment plan',
            'Essential for severe anxiety'
        ]
    },
    {
        title: 'Psychiatric Consultation',
        description: 'Medical evaluation for potential medication management',
        type: 'remedy',
        category: 'professional',
        difficulty: 'Beginner',
        duration: 'As prescribed',
        riskLevels: ['High'],
        icon: 'Heart',
        color: 'bg-red-100 text-red-600',
        steps: [
            'Get referral to psychiatrist from primary care doctor',
            'Attend comprehensive psychiatric evaluation',
            'Discuss medication options and concerns',
            'Follow prescribed medication regimen',
            'Attend regular follow-up appointments',
            'Report side effects or concerns immediately'
        ],
        benefits: [
            'Medical treatment for severe anxiety',
            'Medication can provide significant relief',
            'Professional monitoring and adjustment',
            'Often combined with therapy for best results'
        ]
    },
    {
        title: 'Crisis Support Resources',
        description: 'Immediate help for severe anxiety or mental health emergencies',
        type: 'remedy',
        category: 'professional',
        difficulty: 'Beginner',
        duration: 'As needed',
        riskLevels: ['High'],
        icon: 'Heart',
        color: 'bg-red-100 text-red-600',
        steps: [
            'Save crisis hotline numbers in your phone',
            'National Crisis Hotline: 988 (US)',
            'Crisis Text Line: Text HOME to 741741',
            'Know location of nearest emergency room',
            'Create safety plan with therapist',
            'Reach out immediately if in crisis'
        ],
        benefits: [
            'Immediate support in crisis',
            '24/7 availability',
            'Can prevent escalation',
            'Connects to emergency services if needed'
        ]
    },
    {
        title: 'Intensive Outpatient Program (IOP)',
        description: 'Structured treatment program for severe anxiety requiring intensive support',
        type: 'remedy',
        category: 'professional',
        difficulty: 'Advanced',
        duration: '3-4 hours daily, 3-5 days/week',
        riskLevels: ['High'],
        icon: 'Users',
        color: 'bg-red-100 text-red-600',
        steps: [
            'Get referral from therapist or psychiatrist',
            'Enroll in IOP program at mental health facility',
            'Attend daily group therapy sessions',
            'Participate in individual therapy',
            'Learn and practice coping skills',
            'Complete program (typically 6-12 weeks)',
            'Transition to ongoing outpatient care'
        ],
        benefits: [
            'Intensive treatment without hospitalization',
            'Comprehensive skill-building',
            'Peer support and group therapy',
            'Structured recovery environment'
        ]
    },
    {
        title: 'Mindfulness-Based Stress Reduction (MBSR)',
        description: 'Evidence-based 8-week program combining mindfulness and stress reduction',
        type: 'remedy',
        category: 'professional',
        difficulty: 'Intermediate',
        duration: '8-week program',
        riskLevels: ['High'],
        icon: 'Target',
        color: 'bg-orange-100 text-orange-600',
        steps: [
            'Find certified MBSR program in your area',
            'Commit to 8-week course (2.5 hours weekly)',
            'Practice daily meditation (45 minutes)',
            'Attend weekly group sessions',
            'Complete full-day retreat',
            'Continue practice after program ends'
        ],
        benefits: [
            'Clinically proven anxiety reduction',
            'Develops long-term coping skills',
            'Combines meditation with education',
            'Supported by extensive research'
        ]
    }
];

const seedRecommendations = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected for seeding...');

        // Clear existing recommendations
        await Recommendation.deleteMany({});
        console.log('Cleared existing recommendations');

        // Insert new recommendations
        await Recommendation.insertMany(recommendations);
        console.log(`${recommendations.length} recommendations seeded successfully`);

        // Log summary
        const yogaCount = recommendations.filter(r => r.type === 'yoga').length;
        const meditationCount = recommendations.filter(r => r.type === 'meditation').length;
        const lifestyleCount = recommendations.filter(r => r.type === 'lifestyle').length;
        const remedyCount = recommendations.filter(r => r.type === 'remedy').length;

        console.log('\nSeeding Summary:');
        console.log(`- Yoga Asanas: ${yogaCount}`);
        console.log(`- Meditation: ${meditationCount}`);
        console.log(`- Lifestyle: ${lifestyleCount}`);
        console.log(`- Remedies: ${remedyCount}`);

        process.exit(0);
    } catch (error) {
        console.error('Seeding error:', error);
        process.exit(1);
    }
};

seedRecommendations();
