from neo4j import GraphDatabase
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

class Neo4jDatabase:
    def __init__(self):
        uri = os.getenv("NEO4J_URI")
        user = os.getenv("NEO4J_USER")
        password = os.getenv("NEO4J_PASSWORD")

        # Create a driver instance
        self.driver = GraphDatabase.driver(uri, auth=(user, password))

    def close(self):
        # Close the driver connection when done
        if self.driver:
            self.driver.close()

    def verify_connection(self):
        """Test connection to Neo4j database"""
        try:
            with self.driver.session() as session:
                result = session.run("MATCH (n) RETURN count(n) as count")
                count = result.single()["count"]
                return {"status": "connected", "node_count": count}
        except Exception as e:
            return {"status": "error", "message": str(e)}

    def create_constraints(self):
        """Set up necessary constraints for the database"""
        with self.driver.session() as session:
            # Create constraint for User nodes
            session.run("""
                CREATE CONSTRAINT user_email IF NOT EXISTS
                FOR (u:User) REQUIRE u.email IS UNIQUE
            """)

            # Create constraint for Syllabus nodes
            session.run("""
                CREATE CONSTRAINT syllabus_id IF NOT EXISTS
                FOR (s:Syllabus) REQUIRE s.id IS UNIQUE
            """)

            # Create constraint for Topic nodes
            session.run("""
                CREATE CONSTRAINT topic_id IF NOT EXISTS
                FOR (t:Topic) REQUIRE t.id IS UNIQUE
            """)

            # Create constraint for PYQ nodes
            session.run("""
                CREATE CONSTRAINT pyq_id IF NOT EXISTS
                FOR (p:PYQ) REQUIRE p.id IS UNIQUE
            """)

            # Create constraint for Question nodes
            session.run("""
                CREATE CONSTRAINT question_id IF NOT EXISTS
                FOR (q:Question) REQUIRE q.id IS UNIQUE
            """)

    def initialize_database(self):
        """Initialize the database with necessary constraints"""
        try:
            self.create_constraints()
            return {"status": "success", "message": "Database initialized successfully"}
        except Exception as e:
            return {"status": "error", "message": str(e)}

# Database singleton instance
db = Neo4jDatabase()

# Function to get database instance
def get_db():
    return db