import {BarChart2, BookOpen, ClipboardCheck, Shield} from "lucide-react";

export const UICard01 = [
    {
        icon: <BookOpen className="w-12 h-12 text-blue-600" />,
        title: "AI-Powered Generation",
        description:
            "Create comprehensive question papers in minutes. Our AI ensures pedagogically sound questions aligned with learning outcomes and curriculum objectives.",
    },
    {
        icon: <BarChart2 className="w-12 h-12 text-purple-600" />,
        title: "Analytics Dashboard",
        description:
            "Gain valuable insights into question quality, coverage of Syllabus topics, and alignment with Bloom's taxonomy levels through our intuitive analytics.",
    },
    {
        icon: <Shield className="w-12 h-12 text-blue-600" />,
        title: "Content Security",
        description:
            "Ensure question paper integrity with our advanced security measures including unique paper fingerprinting and encrypted distribution channels.",
    },
    {
        icon: <ClipboardCheck className="w-12 h-12 text-purple-600" />,
        title: "Assessment Quality",
        description:
            "Enhance assessment quality with diversified question types, difficulty calibration, and built-in validation against educational standards.",
    },
];

export const UICard02 = [
    {
        name: "Dr. Alice Smith",
        role: "Professor of Computer Science",
        feedback:
            "Question Forge has transformed our department's assessment process. The AI-generated questions are academically rigorous and save us countless hours of preparation time.",
    },
    {
        name: "Prof. John Davis",
        role: "Head of Mathematics Department",
        feedback:
            "The customization options allow us to create question papers that precisely align with our curriculum learning outcomes. A remarkable tool for modern education.",
    },
    {
        name: "Dr. Sarah Chen",
        role: "Assessment Coordinator",
        feedback:
            "The analytics dashboard provides invaluable insights into topic coverage and question quality. It's fundamentally improved how we approach assessment design.",
    },
]

export const UICard03 = [
    {
        question: "How does the AI ensure pedagogical quality of questions?",
        answer: "Our AI is trained on educational frameworks including Bloom's taxonomy and integrates with Syllabus structures to generate questions that target specific learning outcomes and cognitive levels.",
    },
        {
            question: "Can I customize the assessment format and difficulty?",
            answer: "Yes! You can specify question types (MCQ, fill-in-the-blanks, short answer, long answer), difficulty distributions, and even target specific curriculum topics to generate tailored assessments.",
        },
        {
            question: "How does Question Forge ensure content security?",
            answer: "We implement end-to-end encryption for all generated content, unique paper fingerprinting to trace unauthorized distribution, and secure access controls for all assessment materials.",
        },
        {
            question: "Can I integrate Question Forge with my institution's LMS?",
            answer: "Yes, we offer API integration with popular Learning Management Systems including Canvas, Moodle, and Blackboard to seamlessly incorporate our question generation into your existing workflows.",
        },
    ]