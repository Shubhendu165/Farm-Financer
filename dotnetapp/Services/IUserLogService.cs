namespace dotnetapp.Services{
    public interface IUserLogService
    {
        Task LogActionAsync(int userId, string action);
    }
}