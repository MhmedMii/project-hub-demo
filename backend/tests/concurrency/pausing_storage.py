from threading import Event


class PausingStorage:
    def __init__(self, storage):
        self.storage = storage
        self.waiting = Event()
        self.proceed = Event()

    def __getattr__(self, name):
        return getattr(self.storage, name)

    def pause(self):
        self.waiting.set()
        assert self.proceed.wait(timeout=5)

    def save(self, value):
        self.pause()
        return self.storage.save(value)

    def update(self, identifier, transform):
        self.pause()
        return self.storage.update(identifier, transform)
