from datetime import datetime
from neo4j.time import DateTime
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse

class Neo4jJSONEncoder:
    @staticmethod
    def convert_neo4j_types(obj):
        """Convert Neo4j data types to standard Python types"""
        if isinstance(obj, DateTime):
            # Convert Neo4j DateTime to Python datetime
            return datetime(
                year=obj.year,
                month=obj.month,
                day=obj.day,
                hour=obj.hour,
                minute=obj.minute,
                second=obj.second,
                microsecond=obj.nanosecond // 1000
            ).isoformat()
        return obj

def neo4j_jsonable_encoder(obj):
    """Custom encoder that handles Neo4j data types"""
    # First convert Neo4j types
    if isinstance(obj, dict):
        return {k: Neo4jJSONEncoder.convert_neo4j_types(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [Neo4jJSONEncoder.convert_neo4j_types(item) for item in obj]
    else:
        return Neo4jJSONEncoder.convert_neo4j_types(obj)

    # Then use FastAPI's encoder
    return jsonable_encoder(obj)

def neo4j_json_response(content, **kwargs):
    """Create a JSON response that properly handles Neo4j data types"""
    return JSONResponse(
        content=neo4j_jsonable_encoder(content),
        **kwargs
    )