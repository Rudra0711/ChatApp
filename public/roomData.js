class roomData{

  constructor(){
    this.users=[];
  }

  addUser(id,user,room){
    var user={id,user,room};
      this.users.push(user);
      return user;
  }

  removeUser(id){
    this.users= this.users.filter((user) => {
        return user.id!==id;
    });
    return this.users;
  }

  getUser(id){
    var user=this.users.filter((users) => {
      if(users.id===id){return users.user;}
    });
    var name=user.map((user) => {
      return user.user;
    });

    return name;
  }

  getUserList(room){
    var users= this.users.filter((user) => {
        return user.room===room;
    });
    var userNames=users.map((user) => {
      return user.user;
    });
    return userNames;
  }
}

module.exports = {roomData};

// var obj=new roomData();
// obj.addUser(1,'Rudra','Nodejs');
// obj.addUser(2,'gRudra','Nodejs');
// obj.addUser(3,'Rgudra','React');
// obj.addUser(4,'Rgusfdra','React');
//
// console.log(obj.users);
// 
// console.log(obj.removeUser(2));
//
// console.log(obj.getUser(1));
//
// console.log(obj.getUserList('React'));
