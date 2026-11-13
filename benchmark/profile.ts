import * as entity from "./entity.ts";
import * as user from "./user.ts";

const EST_SECONDS = 5;

function measure(msg: string, callback: () => void) {
    console.log(msg);
    console.time(msg);
    callback();
    console.timeEnd(msg);
}

function testUsingSmallData() {
    const users = user.generateUserData(10);
    measure(`Writing ${users.length} users`, function smallUsers() {
        for (let i = 0; i < 250_000 * EST_SECONDS; i++) {
            user.serializeUsingLibrary(users);
        }
    });

    const entities = entity.generateEntityData(10);
    measure(`Writing ${entities.length} entities`, function smallEntities() {
        for (let i = 0; i < 600_000 * EST_SECONDS; i++) {
            entity.serializeUsingLibrary(entities);
        }
    });
}

function testUsingLargeData() {
    const users = user.generateUserData(10_000);

    measure(`Writing ${users.length} users`, function largeUsers() {
        for (let i = 0; i < 250 * EST_SECONDS; i++) {
            user.serializeUsingLibrary(users);
        }
    });

    const entities = entity.generateEntityData(10_000);
    measure(`Writing ${entities.length} entities`, function largeEntities() {
        for (let i = 0; i < 600 * EST_SECONDS; i++) {
            entity.serializeUsingLibrary(entities);
        }
    });
}

testUsingSmallData();
testUsingLargeData();
