import time
import logging
import threading
from collections import OrderedDict
from typing import Any, Optional

logger = logging.getLogger("app.services.cache")

class LRUCacheWithTTL:
    def __init__(self, capacity: int = 128, ttl_seconds: int = 3600):
        self.capacity = capacity
        self.ttl = ttl_seconds
        self.cache: OrderedDict = OrderedDict()
        self.lock = threading.Lock()
        
        # Simple stats metrics tracker
        self.hits = 0
        self.misses = 0
        self.evictions = 0

    def get(self, key: str) -> Optional[Any]:
        with self.lock:
            if key not in self.cache:
                self.misses += 1
                logger.info(f"Cache Miss for key: {key}")
                return None
                
            value, expires_at = self.cache[key]
            if time.time() > expires_at:
                self.cache.pop(key)
                self.misses += 1
                logger.info(f"Cache Expired for key: {key}")
                return None
                
            self.hits += 1
            self.cache.move_to_end(key)
            logger.info(f"Cache Hit for key: {key}")
            return value

    def set(self, key: str, value: Any) -> None:
        with self.lock:
            expires_at = time.time() + self.ttl
            if key in self.cache:
                self.cache.pop(key)
            self.cache[key] = (value, expires_at)
            self.cache.move_to_end(key)
            
            # Check capacity eviction
            if len(self.cache) > self.capacity:
                oldest_key, _ = self.cache.popitem(last=False)
                self.evictions += 1
                logger.info(f"Cache Eviction (LRU): removed oldest key {oldest_key}")

    def clear(self) -> None:
        with self.lock:
            self.cache.clear()
            self.hits = 0
            self.misses = 0
            self.evictions = 0

    @property
    def hit_ratio(self) -> float:
        total = self.hits + self.misses
        if total == 0:
            return 0.0
        return round(self.hits / total, 2)
